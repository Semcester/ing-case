
import { html, css } from 'lit';
import { BaseLocalizedElement } from './BaseLocalizedElement.js';
import { translate } from "../i18n/index";

import {EDIT_ICON,DELETE_ICON} from '../contants/index';

import '../components/ConfirmDialog';

export class EmployeeTable extends BaseLocalizedElement {
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
      <table>
        <thead>
          <tr>
            <th>${translate("firstName", this.currentLang)}</th>
            <th>${translate("lastName", this.currentLang)}</th>
            <th>${translate("dateOfEmployment", this.currentLang)}</th>
            <th>${translate("dateOfBirth", this.currentLang)}</th>
            <th>${translate("phone", this.currentLang)}</th>
            <th>${translate("email", this.currentLang)}</th>
            <th>${translate("department", this.currentLang)}</th>
            <th>${translate("position", this.currentLang)}</th>
            <th>${translate("actions", this.currentLang)}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(emp => html`
            <tr>
              <td>${emp.firstName}</td>
              <td>${emp.lastName}</td>
              <td>${emp.dateOfEmployment}</td>
              <td>${emp.dateOfBirth}</td>
              <td>${emp.phone}</td>
              <td>${emp.email}</td>
              <td>${emp.department}</td>
              <td>${emp.position}</td>
              <td>
                <button @click=${() => this._onEdit(emp)}>${EDIT_ICON()}</button>
                <button @click=${() => this._onDelete(emp.id)}>${DELETE_ICON()}</button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

static styles = css`
  :host {
    display: block;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }

  thead {
    background-color: #fff;
  }

  thead tr:hover {
    background: none;
  }

  th {
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    color: #ff6600;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
    white-space: nowrap;
  }

  td {
    padding: 1rem;
    font-size: 0.9rem;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    white-space: nowrap;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #fdf4ec;
  }

  td:first-child,
  th:first-child {
    padding-left: 1.25rem;
  }

  td:last-child,
  th:last-child {
    padding-right: 1.25rem;
  }

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    margin-left: 0.5rem;
    font-size: 1rem;
    color: #ff6600;
    transition: transform 0.2s ease;
  }

  button:hover {
    transform: scale(1.1);
  }

  .actions {
    display: flex;
    align-items: center;
  }

  input[type="checkbox"] {
    accent-color: #ff6600;
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    table, thead, tbody, th, td, tr {
      display: block;
    }

    thead {
      display: none;
    }

    tr {
      border: 1px solid #eee;
      border-radius: 8px;
      background: #fff;
      padding: 1rem;
    }

     td {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
  }

  td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #666;
    min-width: 100px;
    flex-shrink: 0;
  }

    td:nth-of-type(1)::before { content: "First Name"; }
    td:nth-of-type(2)::before { content: "Last Name"; }
    td:nth-of-type(3)::before { content: "Employment Date"; }
    td:nth-of-type(4)::before { content: "Birth Date"; }
    td:nth-of-type(5)::before { content: "Phone"; }
    td:nth-of-type(6)::before { content: "Email"; }
    td:nth-of-type(7)::before { content: "Department"; }
    td:nth-of-type(8)::before { content: "Position"; }
    td:nth-of-type(9)::before { content: "Actions"; }

    button {
      margin-top: 0.25rem;
    }
  }
`;
}

customElements.define('employee-table', EmployeeTable);
