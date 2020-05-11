class CreateCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories do |t|
      t.string :name 
      t.float :budgeted, :default => 0.00
      t.float :activity, :default => 0.00
      t.float :available, :default => 0.00

      t.timestamps
    end
  end
end
