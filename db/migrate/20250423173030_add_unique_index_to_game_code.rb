class AddUniqueIndexToGameCode < ActiveRecord::Migration[8.0]
  def change
    add_index :games, :code, unique: true
  end
end
