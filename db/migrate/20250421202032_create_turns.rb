class CreateTurns < ActiveRecord::Migration[8.0]
  def change
    create_table :turns do |t|
      t.integer :score
      t.references :player, null: false, foreign_key: true
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
