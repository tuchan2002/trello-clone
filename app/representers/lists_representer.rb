class ListsRepresenter
  def initialize(lists)
    @lists = lists
  end
  
  def as_json
    lists.map do |list|
      {
        id: list.id,
        title: list.title,
        position: list.position,
        item: list.items.order(position: :asc)
      }
    end
  end
  
  private

  attr_reader :lists
end