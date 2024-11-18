import { LitElement, html, css } from "lit";
import { translate } from "../utils/i18n.js";

class DeleteConfirmationModal extends LitElement {
  static styles = css`
    :host {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 400px;
      position: relative;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    .modal-content h3 {
      color: #ff6600;
    }

    .modal-content p {
      margin-bottom: 20px;
      color: #333;
    }

    .btn-group button {
      padding: 10px 20px;
      margin: 0 10px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      font-size: 16px;
    }

    .modal-content .proceed {
      background-color: #ff6600;
      color: white;
    }

    .modal-content .cancel {
      background-color: #ffffff;
      color: black;
      border: 1px solid black;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;

  static get properties() {
    return {
      open: { type: Boolean },
      employeeName: { type: String },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.employeeName = "";
  }

  render() {
    return html`
      <div class="modal-content">
        <div class="modal-header">
          <h3>${translate("confirmTitle")}</h3>
          <button class="close-btn" @click="${this._cancel}">
            <svg
              width="44px"
              height="44px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" fill="white" />
              <path
                d="M7 17L16.8995 7.10051"
                stroke="#ff6600"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 7.00001L16.8995 16.8995"
                stroke="#ff6600"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <p>
          ${translate("confirmMessage").replace(
            "{employeeName}",
            this.employeeName,
          )}
        </p>
        <div class="btn-group">
          <button class="proceed" @click="${this._confirm}">
            ${translate("proceedButton")}
          </button>
          <button class="cancel" @click="${this._cancel}">
            ${translate("cancelButton")}
          </button>
        </div>
      </div>
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has("open")) {
      this.style.display = this.open ? "flex" : "none";
    }
  }

  _confirm() {
    this.dispatchEvent(
      new CustomEvent("confirm", { bubbles: true, composed: true }),
    );
    const toast = document.getElementById("toast");
    toast.show(translate("employeeDeletedSuccess"), "success");
    this.open = false;
  }

  _cancel() {
    this.open = false;
  }
}

customElements.define("confirmation-modal", DeleteConfirmationModal);
