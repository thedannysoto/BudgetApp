class TransactionsController < ApplicationController
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

        render json: transaction, status: 200
    end

    def update
        transaction = Transaction.find(params[:id])
        if params[:columnName] == "Date"
            transaction.date = params[:value]
        end
        transaction.save
        render json: transaction, status: 200
    end

    def destroy
        transaction = Transaction.find(params[:id])
        transaction.delete
    end

    private 

    def transaction_params 
        params.require(:transaction).permit(:date, :payee, :memo, :amount, :cleared, :acount_id, :category_id, :id, :value, :columnName)
    end
end
