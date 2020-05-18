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
        transaction = Transaction.new
        transaction.date = params[:date]
        transaction.payee = params[:payee]
        transaction.memo = params[:memo]
        transaction.category = Category.find_or_create_by(:name => params[:category])
        transaction.category_name = params[:category]
        if params[:outflow] == "Outflow"
            transaction.outflow = params[:amount].to_f
        else 
            transaction.inflow = params[:amount].to_f 
        end
        transaction.account = Account.find(params[:account])
        transaction.account_name = transaction.account.name
        transaction.save
        
        render json: transaction, status: 200
    end

    def update
        transaction = Transaction.find(params[:id])
        if params[:columnName] == "Date"
            transaction.date = params[:value]
        elsif params[:columnName] == "Category"
            transaction.category = Category.find_by(:name => params[:value])
            transaction.category_name = params[:value]
        elsif params[:columnName] == "Payee"
            transaction.payee = params[:value]
        elsif params[:columnName] == "Memo"
            transaction.memo = params[:value]
        elsif params[:columnName] == "Outflow"
            transaction.outflow = params[:value]
            transaction.inflow = nil
        elsif params[:columnName] == "Inflow"
            transaction.inflow = params[:value]
            transaction.outflow = nil 
        elsif params[:columnName] == "Account"
            transaction.account = Account.find_by(:name => params[:value])
            transaction.account_name = params[:value]
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
