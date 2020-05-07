class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories do |t|
      t.string :name 
      t.decimal :budgeted 
      t.decimal :activity 
      t.decimal :available

      t.timestamps
    end
  end
end
