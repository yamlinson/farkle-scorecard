class AddHostAndAdminToUsers < ActiveRecord::Migration[8.0]
  def change
    change_table :users do |t|
      t.boolean :host, default: false
      t.boolean :admin, default: false
    end
  end
end
