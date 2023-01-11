# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

user = User.create(email: "tran.anh.tu@sun-asterisk.com", password: "123456")

5.times do |i| 
  Board.create(user: user, name: "Board  #{i + 1}")
end

Board.find_each do |board|
  5.times do |i| 
    List.create(board: board, title: "List #{i + 1}", position: i)
  end

  board.lists.each do |list|
    5.times do |i| 
      Item.create(list: list, title: "Item #{i + 1}")
    end
  end
end