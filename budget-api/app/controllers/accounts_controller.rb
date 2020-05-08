class AccountsController < ApplicationController
    def index 
        accounts = Account.all 

        render json: accounts, status: 200
    end

    def show
        account = Account.find(params[:id])

        render json: account, status: 200
    end

    def create
        account = Account.create(account_params)

        render json: account, status: 200
    end

    def update
        account = Account.find(params[:id])
        account.update(account_params)
        render json: account, status: 200
    end

    def destroy
        account = Account.find(params[:id])
        account.delete
    end

    private 

    def account_params 
        params.require(:account).permit(:name, :balance)
    end
end
