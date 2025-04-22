class CreateGames < ActiveRecord::Migration[8.0]
  def change
    create_table :games do |t|
      t.string :code
      t.boolean :started, default: false
      t.boolean :last_round, default: false
      t.boolean :complete, default: false
      t.integer :turns_left
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
