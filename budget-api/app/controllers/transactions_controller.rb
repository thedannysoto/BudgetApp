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
        transaction.account = Account.find(params[:account])
        transaction.account_name = transaction.account.name
        transaction.category = Category.find_or_create_by(:name => params[:category])
        transaction.category_name = params[:category]
      
        if transaction.account.kind == "Bank Account"
            if params[:outflow] == "Outflow"
                transaction.outflow = params[:amount].to_f
                transaction.category.available -= params[:amount].to_f
                transaction.category.activity -= params[:amount].to_f
            else 
                transaction.inflow = params[:amount].to_f 
                transaction.category.available += params[:amount].to_f
                transaction.category.activity += params[:amount].to_f
            end
        else
            account_category = Category.find_by(:name => transaction.account_name)
            if params[:outflow] == "Outflow"
                transaction.outflow = params[:amount].to_f
                transaction.category.available -= params[:amount].to_f
                transaction.category.activity -= params[:amount].to_f
                account_category.available += params[:amount].to_f
                account_category.activity -= params[:amount].to_f
                account_category.save
            else
                budgeted = Category.find(7)
                transaction.inflow = params[:amount].to_f
                budgeted.available += params[:amount].to_f
                budgeted.save
                account_category.available -= params[:amount].to_f 
                account_category.activity += params[:amount].to_f
                account_category.save
            end
        end
        transaction.category.save
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
        if transaction.inflow
            if transaction.account.kind == "Credit Card"
                cat = Category.find_by(:name => transaction.account_name)
                cat.available += transaction.inflow
                cat.activity -= transaction.inflow
                cat.save 
            end
            transaction.category.available -= transaction.inflow
            transaction.category.activity -= transaction.inflow
        else 
            if transaction.account.kind == "Credit Card"
                cat = Category.find_by(:name => transaction.account_name)
                cat.available -= transaction.outflow 
                cat.activity += transaction.outflow
                cat.save 
            end
            transaction.category.available += transaction.outflow
            transaction.category.activity += transaction.outflow
        end
        transaction.category.save
        transaction.delete
    end

    private 

    def transaction_params 
        params.require(:transaction).permit(:date, :payee, :memo, :amount, :cleared, :acount_id, :category_id, :id, :value, :columnName)
    end
end
