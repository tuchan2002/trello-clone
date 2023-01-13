class ItemRepresenter
  def initialize(item)
    @item = item
  end
  
  def as_json
      {
        id: item.id,
        title: item.title,
        description: item.description,
        position: item.position,
        list_id: item.list_id,
        members: item.members
      }
  end
  
  private

  attr_reader :item
end