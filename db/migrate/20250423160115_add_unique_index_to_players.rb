class AddUniqueIndexToPlayers < ActiveRecord::Migration[8.0]
  def change
    add_index :players, [ :name, :game_id ], unique: true
  end
end
