import { LitElement, html, css } from "lit";

class ToastMessage extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background-color: #ff6600 !important;
      color: white;
      border-radius: 8px;
      font-size: 14px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 10px !important;
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity 0.3s ease,
        transform 0.3s ease;
    }

    :host(.show) {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    :host(.hide) {
      display: block;
      opacity: 0;
      transform: translateY(20px);
    }

    .success {
      background-color: #28a745;
    }

    .error {
      background-color: #dc3545;
    }

    .info {
      background-color: #007bff;
    }
  `;

  static get properties() {
    return {
      message: { type: String },
      type: { type: String },
    };
  }

  constructor() {
    super();
    this.message = "";
    this.type = "info";
    this.classList.add("hide");
  }

  show(message, type = "info") {
    this.message = message;
    this.type = type;
    this.classList.remove("hide");
    this.classList.add("show", type);
    this.requestUpdate();

    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    this.classList.remove("show", this.type);
    this.classList.add("hide");
  }

  render() {
    return html`<span>${this.message}</span>`;
  }
}

customElements.define("toast-message", ToastMessage);
