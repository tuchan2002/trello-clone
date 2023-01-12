import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["cancelButton"];

  connect() {
    this.getModalWrapper().addEventListener("click", (e) => {
      this.closeModal(e);
    });
    this.cancelButtonTarget.addEventListener("click", (e) => {
      this.getModalWrapper().classList.add("hidden");
    });
  }

  closeModal(e) {
    const isModalPanelClicked = document
      .querySelector("#modal-panel")
      .contains(e.target);

    if (!isModalPanelClicked) {
      this.getModalWrapper().classList.add("hidden");
    }
  }

  openModal() {
    this.getModalWrapper().classList.remove("hidden");
  }

  getModalWrapper() {
    return document.querySelector("#modal-wrapper");
  }
}
