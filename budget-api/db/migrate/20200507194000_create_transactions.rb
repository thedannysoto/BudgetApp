class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.date :date 
      t.string :payee
      t.string :memo 
      t.decimal :amount 
      t.boolean :cleared 
      t.references :account, foreign_key: true
      t.references :category, foreign_key: true 
      t.timestamps
    end
  end
end
