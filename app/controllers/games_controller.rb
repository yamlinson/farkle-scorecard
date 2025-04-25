class GamesController < ApplicationController
  def index
  end

  def new
  end

  def show
    set_game
    set_players
    set_turns
  end

  def start_game
    player_names = params.require(:players)

    if player_names.uniq.length != player_names.length
      render json: { message: "Player names must be unique" }, status: :unprocessable_entity
      return
    end

    if player_names.length < 1
      render json: { message: "Must have at least one player to start" }, status: :unprocessable_entity
    end

    game_code = generate_game_code

    @game = Game.new()

    @game.user_id = Current.user.id
    @game.code = game_code
    @game.started = true

    if @game.save
      player_ids = []

      player_names.each_with_index do |name, index|
        player = Player.create(name: name, game_id: @game.id, turn_order: index+1, score: 0)
        player_ids << player.id if player.persisted?
      end

      render json: { message: "Game created successfully:", id: @game.id }, status: :created
    else
      render json: { errors: @game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    game = Game.find(params.expect(:id))
    players = Player.where(game_id: game.id)
    turns = Turn.where(game_id: game.id)

    current_turn = (turns.length % players.length) + 1
    current_player = players.find { |player| player.turn_order == current_turn }
    if current_turn == players.length
      next_turn = 1
    else
      next_turn = (turns.length % players.length) + 2
    end
    next_player = players.find { |player| player.turn_order == next_turn }

    turn_score = params.require(:score)

    Turn.create(
      player_id: current_player.id,
      game_id: game.id,
      score: turn_score
    )

    new_score = current_player.score + turn_score
    current_player.score = new_score

    if current_player.save
      render json: {
        message: "Turn submitted successfully",
        newScore: {
          "name" => current_player.name,
          "score" => new_score
        },
        nextPlayerName: next_player.name },
        status: :created
    else
      render json: { error: "Could not submit turn" }, status: :unprocessable_entity
    end
  end

  # Utils
  private

  def set_game
    @game = Game.find(params.expect(:id))
  end

  def set_players
    @players = Player.where(game_id: params.expect(:id))
  end

  def set_turns
    @turns = Turn.where(game_id: params.expect(:id))
  end

  def generate_game_code
    loop do
      game_code = Array.new(6) { ("A".."Z").to_a.sample }.join
      break game_code unless Game.exists?(code: game_code)
    end
  end
end
