class AddKindToAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :kind, :string
  end
end
