class CreateGames < ActiveRecord::Migration[8.0]
  def change
    create_table :games do |t|
      t.string :code
      t.boolean :started
      t.boolean :last_round
      t.boolean :complete
      t.integer :turns_left
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
