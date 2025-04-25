class AddDefaultScoreToPlayer < ActiveRecord::Migration[8.0]
  def change
    change_column_default :players, :score, 0
  end
end
