import { html, css } from 'lit';
import { BaseLocalizedElement } from './BaseLocalizedElement.js';
import { translate } from "../i18n/index";

export class ConfirmDialog extends BaseLocalizedElement {
  static properties = {
    open: { type: Boolean },
    employee: { type: Object },
  };

  constructor() {
    super();
    this.open = false;
    this.employee = null;
  }

  _close() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  _confirm() {
    this.dispatchEvent(new CustomEvent('confirm', {
      detail: { id: this.employee?.id },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.open || !this.employee) return null;
    return html`
      <div class="overlay">
        <div class="modal">
          <div class="header">
            <span class="title">${translate("confirmTitle", this.currentLang)}</span>
            <button class="close" @click=${this._close}>×</button>
          </div>
          <div class="message">
            ${translate("confirmMessage", this.currentLang)} <strong>${this.employee.firstName} ${this.employee.lastName}</strong>
          </div>
          <div class="actions">
            <button class="proceed" @click=${this._confirm}>${translate("deleteBtn", this.currentLang)}</button>
            <button class="cancel" @click=${this._close}>${translate("cancelButton", this.currentLang)}</button>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }

    .modal {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      min-width: 320px;
      max-width: 90%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 1.1rem;
      color: #ff6600;
      margin-bottom: 1rem;
    }

    .close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #ff6600;
    }

    .message {
      font-size: 0.95rem;
      margin-bottom: 1.25rem;
      color: #333;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .proceed {
      background-color: #ff6600;
      color: white;
      border: none;
      padding: 0.6rem;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }

    .cancel {
      border: 1px solid #645FA1;
      background: white;
      color: #645FA1;
      padding: 0.6rem;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }

    .cancel:hover {
      background: #f7f7f7;
    }
  `;
}

customElements.define('confirm-dialog', ConfirmDialog);
