class Api::ItemsController < ApplicationController
  protect_from_forgery with: :null_session

  def show
    item = Item.find(params[:id])

    render json: item
  end
  
end
