class Category < ApplicationRecord
    has_many :transactions 
    has_many :accounts, through: :transactions
end