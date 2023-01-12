class ItemsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def new
    @item = list.items.new
  end

  def edit
    @item = list.items.find(params[:id])
  end

  def create
    @item = list.items.new(item_params)

    if @item.save
      redirect_to board_path(list.board)
    else
      render :new
    end
  end

  def update
    @item = list.items.find(params[:id])
    
    if @item.update(item_params)
      redirect_to board_path(list.board)
    else 
      render :edit
    end
  end

  def destroy
    @item = list.items.find(params[:id])
    @item.destroy

    head :no_content
  end

  private

  def list
    @list ||= List.find(params[:list_id])
  end

  def item_params
    params.require(:item).permit(:title, :description)
  end
end
