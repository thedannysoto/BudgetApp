class TransactionController < ApplicationController
    def index 
        transactions = Transaction.all 

        render json: transactions, status: 200
    end

    def show
        transaction = Transaction.find(params[:id])

        render json: transaction, status: 200
    end

    def create
        transaction = Transaction.create(transaction_params)
    end

    private 

    def transaction_params 
        params.require(:transaction).permit()
    end
end
