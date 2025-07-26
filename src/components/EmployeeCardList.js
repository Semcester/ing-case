import { html, css } from 'lit';
import { BaseLocalizedElement } from './BaseLocalizedElement.js';
import { translate } from "../i18n/index";

import {EDIT_ICON_WHITE,DELETE_ICON_WHITE} from '../contants/index';

export class EmployeeCardList extends BaseLocalizedElement {
  static properties = {
    employees: { type: Array },
  };

  _onEdit(employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', {
      detail: employee,
      bubbles: true,
      composed: true,
    }));
  }

  _onDelete(id) {
    this.dispatchEvent(new CustomEvent('delete-employee', {
      detail: { id },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
   return html`
  <div class="grid">
    ${this.employees.map(emp => html`
      <div class="card">
        <div class="row">
          <div class="field">
            <span class="label">${translate("firstName", this.currentLang)}</span>
            <span class="value">${emp.firstName}</span>
          </div>
          <div class="field">
            <span class="label">${translate("lastName", this.currentLang)}</span>
            <span class="value">${emp.lastName}</span>
          </div>
          <div class="field">
            <span class="label">${translate("dateOfEmployment", this.currentLang)}</span>
            <span class="value">${emp.dateOfEmployment}</span>
          </div>
          <div class="field">
            <span class="label">${translate("dateOfBirth", this.currentLang)}</span>
            <span class="value">${emp.dateOfBirth}</span>
          </div>
          <div class="field">
            <span class="label">${translate("phone", this.currentLang)}</span>
            <span class="value">${emp.phone}</span>
          </div>
          <div class="field">
            <span class="label">${translate("email", this.currentLang)}</span>
            <span class="value">${emp.email}</span>
          </div>
          <div class="field">
            <span class="label">${translate("department", this.currentLang)}</span>
            <span class="value">${emp.department}</span>
          </div>
          <div class="field">
            <span class="label">${translate("position", this.currentLang)}</span>
            <span class="value">${emp.position}</span>
          </div>
        </div>
        <div class="actions">
          <button class="editBtn" @click=${() => this._onEdit(emp)}>${EDIT_ICON_WHITE()}${translate("editBtn", this.currentLang)}</button>
          <button class="deleteBtn" @click=${() => this._onDelete(emp.id)}>${DELETE_ICON_WHITE()}${translate("deleteBtn", this.currentLang)}</button>
        </div>
      </div>
    `)}
  </div>
`;

  }

 static styles = css`
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    justify-content: center;
    padding: 1rem;
    max-width: 1024px;
    margin: 0 auto;
  }

  .card {
    background: #fff;
    padding: 1.25rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
  }

  .label {
    color: #999;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .value {
    font-weight: 500;
    color: #111;
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-start;
    margin-top: 0.5rem;
  }
  .deleteBtn{
    background-color:#ff6600;
  }
    .editBtn{
    background-color:#645FA1;
  }
  button {
    border: none;
    padding: 0.4rem 0.75rem;
    color: #fff;
    font-size: 0.85rem;
    border-radius: 4px;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .row {
      grid-template-columns: 1fr;
    }
  }
`;
}

customElements.define('employee-card-list', EmployeeCardList);
