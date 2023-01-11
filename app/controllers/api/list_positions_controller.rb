class Api::ListPositionsController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def update
    lists = board.lists.order(position: :asc).to_a
    delete_index = lists.index { |list| list.id == params[:id].to_i }
    list = lists.delete_at(delete_index)
    lists.insert(params[:position].to_i, list)
    lists.each_with_index do |list, index|
      list.position = index
    end

    List.import lists,  on_duplicate_key_update: [:position]

    render json: ListsRepresenter.new(lists).as_json
  end

  private

  def board
    @board ||= Board.find(params[:board_id])
  end
end
