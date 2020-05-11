class CreateAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :accounts do |t|
      t.string :name 
      t.float :amount, :default => 0.00 

      t.timestamps
    end
  end
end
