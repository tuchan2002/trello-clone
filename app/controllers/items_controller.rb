class ItemsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def new
    @item = list.items.new
  end

  # def edit
  #   @list = board.lists.find(params[:id])
  # end

  def create
    @item = list.items.new(item_params)

    if @item.save
      redirect_to board_path(list.board)
    else
      render :new
    end
  end

  # def update
  #   @list = board.lists.find(params[:id])
    
  #   if @list.update(list_params)
  #     redirect_to board_path(board)
  #   else 
  #     render :edit
  #   end
  # end

  # def destroy
  #   @list = board.lists.find(params[:id])
  #   @list.destroy

  #   head :no_content
  # end

  private

  def list
    @list ||= List.find(params[:list_id])
  end

  def item_params
    params.require(:item).permit(:title, :description)
  end
end
