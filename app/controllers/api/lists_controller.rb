class Api::ListsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def index
    lists = board.lists.order(position: :asc)
    
    render json: ListsRepresenter.new(lists).as_json
  end
  
  private

  def board
    @board ||= Board.find(params[:board_id])
  end
end
