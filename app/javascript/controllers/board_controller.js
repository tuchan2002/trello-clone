import { Controller } from "@hotwired/stimulus";
import axios from "axios";

export default class extends Controller {
  connect() {
    axios.get(this.element.dataset.apiUrl).then((response) => {
      const boards = this.buildBoards(response.data);
      console.log(boards);

      this.buildKanban(boards);
      this.cursorifyHeaderTitles();
      this.addLinkToHeaderTitles(boards);
      this.addHeaderDeleteButtons(boards);
    });
  }

  buildClassList() {
    return `text-white, bg-blue-700`;
  }

  buildBoards(boardsData) {
    return boardsData.map((board) => ({
      ...board,
      id: `${board.id}`,
      class: this.buildClassList(),
      item: board.item.map((ite) => ({ ...ite, id: `${ite.id}` })),
    }));
  }

  buildKanban(boards) {
    new jKanban({
      element: `#${this.element.id}`, // selector of the kanban container
      boards, // json of boards
      itemAddOptions: {
        enabled: true, // add a button to board for easy item creation
      },
      click: () => {},
      dragendBoard: (el) => {
        console.log("board.id", el.dataset.id);
        console.log("board.position", el.dataset.order - 1);

        axios
          .put(`${this.element.dataset.listPositionsApiUrl}/${el.dataset.id}`, {
            position: el.dataset.order - 1,
          })
          .then((response) => {
            console.log(response.data);
          });
      }, // callback when any board stop drag
    });
  }

  getHeaderTitles() {
    return document.querySelectorAll(".kanban-title-board");
  }

  getHeaders() {
    return document.querySelectorAll(".kanban-board-header");
  }

  cursorifyHeaderTitles() {
    this.getHeaderTitles().forEach((headerTitle) => {
      headerTitle.classList.add("cursor-pointer");
    });
  }

  addLinkToHeaderTitles(boards) {
    this.getHeaderTitles().forEach((headerTitle, index) => {
      headerTitle.addEventListener("click", () => {
        Turbo.visit(
          `${this.element.dataset.boardListsUrl}/${boards[index].id}/edit`
        );
      });
    });
  }

  buildBoardDeleteButton(boardId) {
    const button = document.createElement("button");
    button.classList.add("kanban-title-button", "btn", "btn-default", "btn-xs");
    button.textContent = "x";
    button.addEventListener("click", (e) => {
      e.preventDefault();

      axios
        .delete(`${this.element.dataset.boardListsUrl}/${boardId}`)
        .then((response) => {
          Turbo.visit(window.location.href);
        });
    });
    return button;
  }

  addHeaderDeleteButtons(boards) {
    this.getHeaders().forEach((header, index) => {
      header.appendChild(this.buildBoardDeleteButton(boards[index].id));
    });
  }
}
