class Api::ItemPositionsController < ApplicationController
  protect_from_forgery with: :null_session

  def update
    
    items = items_params[:items].map do |item_data|
      item = Item.find(item_data[:id])
      item.position = item_data[:position]
      item.list_id = item_data[:list_id]
      item
    end

    Item.import items, on_duplicate_key_update: [:position, :list_id]

    render json: items
  end

  private

  def items_params
    params
  end
end
