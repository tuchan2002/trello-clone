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

  updateListPosition(el) {
    axios
      .put(`${this.element.dataset.listPositionsApiUrl}/${el.dataset.id}`, {
        position: el.dataset.order - 1,
      })
      .then((response) => {
        console.log(response.data);
      });
  }

  buildKanban(boards) {
    new jKanban({
      element: `#${this.element.id}`,
      boards,
      itemAddOptions: {
        enabled: true,
      },
      dropEl: (el, target, source, sibling) => {
        console.log("dropEl", el);
        console.log("target", target);
        console.log("source", source);
        console.log("sibling", sibling);

        const targetItems = target.querySelectorAll(".kanban-item");
        const sourceItems = source.querySelectorAll(".kanban-item");

        console.log(
          "target.closest(.kanban-board)",
          target.closest(".kanban-board")
        );
      },
      buttonClick: (el, listId) => {
        Turbo.visit(`/lists/${listId}/items/new`);
      },
      dragendBoard: (el) => {
        console.log("board.id", el.dataset.id);
        console.log("board.position", el.dataset.order - 1);
        this.updateListPosition(el);
      },
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
    button.classList.add(
      "kanban-title-button",
      "btn",
      "btn-default",
      "btn-xs",
      "mr-4"
    );
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
