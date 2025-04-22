class GamesController < ApplicationController
  def index
  end

  def new
  end

  def show
    set_game
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
        player = Player.create(name: name, game_id: @game.id, turn_order: index+1)
        player_ids << player.id if player.persisted?
      end

      render json: { message: "Game created successfully:", id: @game.id }, status: :created
    else
      render json: { errors: @game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Utils
  private

  def set_game
    @game = Game.find(params.expect(:id))
  end

  def generate_game_code
    loop do
      game_code = Array.new(6) { ("A".."Z").to_a.sample }.join
      break game_code unless Game.exists?(code: game_code)
    end
  end
end
