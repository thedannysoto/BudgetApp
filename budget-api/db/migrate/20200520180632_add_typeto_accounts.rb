class AddTypetoAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :type, :string
  end
end
