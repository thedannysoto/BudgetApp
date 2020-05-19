class Account < ApplicationRecord 
    has_many :transactions 
    has_many :categories, through: :transactions

    def get_balance(account)
        transaction_array = []
        self.transactions.each do |tr|
            if tr[:outflow]
                transaction_array.push(-tr[:outflow])
            else 
                transaction_array.push(tr[:inflow])
            end
        end
        balance = transaction_array.reduce(self.amount) {|sum, num| sum + num}
    end
end