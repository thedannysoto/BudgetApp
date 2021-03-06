class CategoriesController < ApplicationController
    def index 
        categories = Category.all 

        render json: categories, status: 200
    end

    def show
        category = Category.find(params[:id])

        render json: category, status: 200
    end

    def create
        category = Category.create(category_params)

        render json: category, status: 200
    end

    def update
        category = Category.find(params[:id])
        budgeted = Category.find(7)
        category[:available] -= (category[:budgeted] - params[:value].to_f)
        budgeted.available += (category[:budgeted] - params[:value].to_f)
        category[:budgeted] = params[:value].to_f
        budgeted.save
        category.save
        render json: category, status: 200
    end

    def destroy
        category = Category.find(params[:id])
        category.delete
    end

    private 

    def category_params 
        params.require(:category).permit(:name, :budgeted, :activity, :available)
    end
end
