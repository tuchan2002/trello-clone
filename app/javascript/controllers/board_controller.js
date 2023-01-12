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

  updateItemPosition(target, source) {
    const targetItems = [...target.querySelectorAll(".kanban-item")];
    const sourceItems = [...source.querySelectorAll(".kanban-item")];

    targetItems.forEach((targetItem, index) => {
      targetItem.dataset.position = index;
      targetItem.dataset.listId = target.closest(".kanban-board").dataset.id;
    });
    sourceItems.forEach((sourceItem, index) => {
      sourceItem.dataset.position = index;
      sourceItem.dataset.listId = source.closest(".kanban-board").dataset.id;
    });

    const targetItemsData = targetItems.map((targetItem) => ({
      id: targetItem.dataset.eid,
      position: targetItem.dataset.position,
      list_id: targetItem.dataset.listId,
    }));
    const sourceItemsData = sourceItems.map((targetItem) => ({
      id: targetItem.dataset.eid,
      position: targetItem.dataset.position,
      list_id: targetItem.dataset.listId,
    }));

    axios
      .put(`${this.element.dataset.itemPositionsApiUrl}`, {
        items: targetItemsData,
      })
      .then((response) => {
        console.log(response.data);
      });

    axios
      .put(`${this.element.dataset.itemPositionsApiUrl}`, {
        items: sourceItemsData,
      })
      .then((response) => {
        console.log(response.data);
      });
  }

  openItemModal() {
    document.querySelector("#modal-wrapper").classList.remove("hidden");
  }

  generateItemInfomation(el) {
    axios.get(`/api/items/${el.dataset.eid}`).then((response) => {
      document.querySelector("#item-title").textContent = response.data.title;
      document.querySelector("#item-description").textContent =
        response.data.description;
      document.querySelector(
        "#item-edit-link"
      ).href = `/lists/${response.data.list_id}/items/${el.dataset.eid}/edit`;
      document
        .querySelector("#item-delete-link")
        .addEventListener("click", (e) => {
          e.preventDefault();
          axios
            .delete(`/lists/${response.data.list_id}/items/${el.dataset.eid}`)
            .then((response) => {
              Turbo.visit(window.location.href);
            });
        });
    });
  }

  buildKanban(boards) {
    new jKanban({
      element: `#${this.element.id}`,
      boards,
      itemAddOptions: {
        enabled: true,
      },
      click: (el) => {
        this.openItemModal();
        this.generateItemInfomation(el);
      },
      dropEl: (el, target, source, sibling) => {
        this.updateItemPosition(target, source);
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
    return [...document.querySelectorAll(".kanban-title-board")];
  }

  getHeaders() {
    return [...document.querySelectorAll(".kanban-board-header")];
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
      "mr-4",
      "font-bold"
    );
    button.innerHTML = "&#x2715";
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
      header.appendChild(this.buildBoardDeleteButton(boards[index]?.id));
    });
  }
}
