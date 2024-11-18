import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";

import store from "../store/store.js";
import { deleteEmployee, selectEmployee } from "../store/store.js";

import { translate } from "../utils/i18n.js";
import "../components/delete-confirmation-modal.js";

import { debounce } from "lodash-es";

class EmployeeListView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 16px;
      max-width: 1440px;
      min-width: 600px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 16px;
      color: #ff6600;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-toggle button {
      background: none;
      border: none;
      padding: 6px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      transition:
        background-color 0.3s,
        color 0.3s;
    }

    .view-toggle button.active {
      background-color: rgba(255, 102, 0, 0.1);
      color: white;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
    }

    th,
    td {
      border-bottom: 1px solid #f0f0f0;
      padding: 12px;
      text-align: left;
    }

    th {
      background-color: #f8f8f8;
      color: #ff6600;
      font-weight: bold;
    }

    tr:hover {
      background-color: rgba(255, 102, 0, 0.1);
    }

    .list-view {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .list-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 12px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }
    .list-item-data {
      display: flex;
      flex-direction: column;
      align-items: start;
    }

    .list-item .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      grid-column: span 2;
    }
    .list-item div {
      display: flex;
      align-items: start;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
    }

    .icon-button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .icon-button:hover {
      background-color: rgba(255, 102, 0, 0.1);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      font-size: 16px;
    }

    .pagination button {
      background: none;
      border: none;
      margin: 0 5px;
      cursor: pointer;
      color: #ff6600;
    }
    .pagination button svg {
      stroke: #ff6600;
    }

    .pagination button:disabled {
      color: #ccc;
      cursor: not-allowed;
    }

    .pagination .page-number {
      margin: 0 5px;
      padding: 8px 12px;
      border-radius: 50%;
      cursor: pointer;
    }

    .pagination .page-number.active {
      background-color: #ff6600;
      color: white;
    }
    input[type="checkbox"] {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      outline: none;
      transition:
        background-color 0.2s,
        border-color 0.2s;
    }

    input[type="checkbox"]:checked {
      background-color: #ff6600;
      border-color: #ff6600;
    }

    input[type="checkbox"]:checked::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 5px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .header-search {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .search-input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      height: 1rem;
      margin-right: 16px;
    }
    .search-input:focus {
      border-color: #ff6600;
      outline: none;
      box-shadow: 0 0 4px rgba(255, 102, 0, 0.5);
    }
    .search-container {
      position: relative;
      display: inline-block;
    }
    .clear-icon {
      position: absolute;
      top: 55%;
      right: 25px;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 16px;
      color: #888;
      transition: color 0.2s;
    }
  `;

  static get properties() {
    return {
      employees: { type: Array },
      currentPage: { type: Number },
      pageSize: { type: Number },
      currentView: { type: String },
      selectedEmployees: { type: Array },
      employeeToDelete: { type: Object },
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.currentView = "table";
    this.selectedEmployees = [];
    this.employeeToDelete = null;
    this.filteredEmployees = this.employees;
    this.searchTerm = "";

    this._performSearch = debounce(this._onSearch.bind(this), 500);

    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.employees = state.employees.employees;
      this.filteredEmployees = [...this.employees];
      this.requestUpdate();
    });

    this.employees = store.getState().employees.employees;
    this.filteredEmployees = [...this.employees];
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("language-changed", this._onLanguageChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) this.unsubscribe();
    document.removeEventListener("language-changed", this._onLanguageChanged);
  }

  _onLanguageChanged = () => {
    this.requestUpdate();
  };

  _toggleView(view) {
    this.currentView = view;
  }

  _selectEmployee(event, employeeId) {
    if (event.target.checked) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (id) => id !== employeeId,
      );
    }
  }

  _selectAll(event) {
    if (event.target.checked) {
      this.selectedEmployees = this.employees.map((employee) => employee.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  _onSearch(event) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(this.searchTerm) ||
        employee.lastName.toLowerCase().includes(this.searchTerm) ||
        employee.email.toLowerCase().includes(this.searchTerm) ||
        employee.department.toLowerCase().includes(this.searchTerm) ||
        employee.position.toLowerCase().includes(this.searchTerm)
      );
    });
    this.requestUpdate();
  }
  _clearSearch() {
    this.searchTerm = "";
    this.filteredEmployees = this.employees;
    this.requestUpdate();
  }

  _performSearch(searchTerm) {
    this.filteredEmployees = this.employees.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(searchTerm) ||
        employee.lastName.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm)
      );
    });

    const totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages > 0 ? totalPages : 1;
    }
    this.requestUpdate();
  }

  _editEmployee(employee) {
    store.dispatch(selectEmployee(employee));
    Router.go(`/edit/${employee.id}`);
  }

  _showDeleteConfirmation(employee) {
    this.employeeToDelete = null;
    this.requestUpdate();
    setTimeout(() => {
      this.employeeToDelete = employee;
      this.requestUpdate();
    }, 0);
  }

  _closeDeleteConfirmation() {
    this.employeeToDelete = null;
  }

  _confirmDelete() {
    if (this.employeeToDelete) {
      store.dispatch(deleteEmployee(this.employeeToDelete.id));
      const toast = document.getElementById("toast");
      toast.show(translate("employeeDeletedSuccess"), "success");
      this.employeeToDelete = null;
    }
  }

  _renderPagination() {
    const totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    const maxVisiblePages = 5;
    const pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      const start = Math.max(this.currentPage - 2, 2);
      const end = Math.min(this.currentPage + 2, totalPages - 1);

      if (start > 2) {
        pageNumbers.push("...");
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return html`
      <div class="pagination">
        <button
          @click="${this._prevPage}"
          ?disabled="${this.currentPage === 1}"
          aria-label="Previous Page"
        >
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        ${pageNumbers.map((page) =>
          page === "..."
            ? html`<span class="ellipsis">...</span>`
            : html`
                <span
                  class="page-number ${this.currentPage === page
                    ? "active"
                    : ""}"
                  @click="${() => this._goToPage(page)}"
                >
                  ${page}
                </span>
              `,
        )}
        <button
          @click="${this._nextPage}"
          ?disabled="${this.currentPage === totalPages}"
          aria-label="Next Page"
        >
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L14.15 10C14.4237 10.2563 14.6419 10.5659 14.791 10.9099C14.9402 11.2539 15.0171 11.625 15.0171 12C15.0171 12.375 14.9402 12.7458 14.791 13.0898C14.6419 13.4339 14.4237 13.7437 14.15 14L9 19"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    `;
  }

  _prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  _nextPage() {
    const totalPages = Math.ceil(this.employees.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage += 1;
    }
  }

  _goToPage(page) {
    this.currentPage = page;
  }

  _renderTableView() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedEmployees = this.filteredEmployees.slice(start, end);

    if (this.filteredEmployees.length === 0) {
      return html`
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" @change="${this._selectAll}" /></th>
              <th>${translate("firstName")}</th>
              <th>${translate("lastName")}</th>
              <th>${translate("dateOfEmployment")}</th>
              <th>${translate("dateOfBirth")}</th>
              <th>${translate("phone")}</th>
              <th>${translate("email")}</th>
              <th>${translate("department")}</th>
              <th>${translate("position")}</th>
              <th>${translate("actions")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="10" style="text-align: center; color: #ff6600;">
                ${translate("noEmployeesFound")}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }

    return html`
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" @change="${this._selectAll}" /></th>
            <th>${translate("firstName")}</th>
            <th>${translate("lastName")}</th>
            <th>${translate("dateOfEmployment")}</th>
            <th>${translate("dateOfBirth")}</th>
            <th>${translate("phone")}</th>
            <th>${translate("email")}</th>
            <th>${translate("department")}</th>
            <th>${translate("position")}</th>
            <th>${translate("actions")}</th>
          </tr>
        </thead>
        <tbody>
          ${paginatedEmployees.map(
            (employee) => html`
              <tr>
                <td>
                  <input
                    type="checkbox"
                    .checked="${this.selectedEmployees.includes(employee.id)}"
                    @change="${(e) => this._selectEmployee(e, employee.id)}"
                  />
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.dateOfEmployment}</td>
                <td>${employee.dateOfBirth}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>
                  <button
                    class="icon-button"
                    @click="${() => this._editEmployee(employee)}"
                  >
                    <svg
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                        stroke="#ff6600"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                        stroke="#ff6600"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    class="icon-button"
                    @click="${() => this._showDeleteConfirmation(employee)}"
                  >
                    <svg
                      fill="#ff6600"
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  _renderListView() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedEmployees = this.filteredEmployees.slice(start, end);

    if (this.filteredEmployees.length === 0) {
      return html`
        <div class="list-item">
          <div class="list-item-data">
            <div style="text-align: center; color: #ff6600;">
              ${translate("noEmployeesFound")}
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="list-view">
        ${paginatedEmployees.map(
          (employee) => html`
            <div class="list-item">
              <div class="list-item-data">
                <div>${translate("firstName")}: ${employee.firstName}</div>
                <div>${translate("lastName")}: ${employee.lastName}</div>
                <div>
                  ${translate("dateOfEmployment")}: ${employee.dateOfEmployment}
                </div>
                <div>${translate("dateOfBirth")}: ${employee.dateOfBirth}</div>
                <div>${translate("phone")}: ${employee.phone}</div>
                <div>${translate("email")}: ${employee.email}</div>
                <div>${translate("department")}: ${employee.department}</div>
                <div>${translate("position")}: ${employee.position}</div>
              </div>
              <div class="actions">
                <button
                  class="icon-button"
                  @click="${() => this._editEmployee(employee)}"
                >
                  <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                      stroke="#ff6600"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                      stroke="#ff6600"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  class="icon-button"
                  @click="${() => this._showDeleteConfirmation(employee)}"
                >
                  <svg
                    fill="#ff6600"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="header">
        <div class="header-search">
          <h2>${translate("employeeListTitle")}</h2>
          <div class="search-container">
            <input
              type="text"
              placeholder="${translate("searchPlaceholder")}"
              @input="${this._onSearch}"
              .value="${this.searchTerm || ""}"
              class="search-input"
            />
            ${this.searchTerm
              ? html`
                  <span class="clear-icon" @click="${this._clearSearch}">
                    <svg
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 9L15 15"
                        stroke="#ff6600"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15 9L9 15"
                        stroke="#ff6600"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#ff6600"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                `
              : ""}
          </div>
        </div>

        <div class="view-toggle">
          <button
            class="${this.currentView === "list" ? "active" : ""}"
            @click="${() => this._toggleView("list")}"
          >
            <svg
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z"
                stroke="#ff6600"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="${this.currentView === "table" ? "active" : ""}"
            @click="${() => this._toggleView("table")}"
          >
            <svg
              width="16px"
              height="16px"
              viewBox="0 0 28 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="Page-1"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Icon-Set"
                  transform="translate(-102.000000, -933.000000)"
                  fill="#ff6600"
                >
                  <path
                    d="M128,941 C128,942.104 127.104,943 126,943 L122,943 C120.896,943 120,942.104 120,941 L120,937 C120,935.896 120.896,935 122,935 L126,935 C127.104,935 128,935.896 128,937 L128,941 L128,941 Z M126,933 L122,933 C119.791,933 118,934.791 118,937 L118,941 C118,943.209 119.791,945 122,945 L126,945 C128.209,945 130,943.209 130,941 L130,937 C130,934.791 128.209,933 126,933 L126,933 Z M128,957 C128,958.104 127.104,959 126,959 L122,959 C120.896,959 120,958.104 120,957 L120,953 C120,951.896 120.896,951 122,951 L126,951 C127.104,951 128,951.896 128,953 L128,957 L128,957 Z M126,949 L122,949 C119.791,949 118,950.791 118,953 L118,957 C118,959.209 119.791,961 122,961 L126,961 C128.209,961 130,959.209 130,957 L130,953 C130,950.791 128.209,949 126,949 L126,949 Z M112,941 C112,942.104 111.104,943 110,943 L106,943 C104.896,943 104,942.104 104,941 L104,937 C104,935.896 104.896,935 106,935 L110,935 C111.104,935 112,935.896 112,937 L112,941 L112,941 Z M110,933 L106,933 C103.791,933 102,934.791 102,937 L102,941 C102,943.209 103.791,945 106,945 L110,945 C112.209,945 114,943.209 114,941 L114,937 C114,934.791 112.209,933 110,933 L110,933 Z M112,957 C112,958.104 111.104,959 110,959 L106,959 C104.896,959 104,958.104 104,957 L104,953 C104,951.896 104.896,951 106,951 L110,951 C111.104,951 112,951.896 112,953 L112,957 L112,957 Z M110,949 L106,949 C103.791,949 102,950.791 102,953 L102,957 C102,959.209 103.791,961 106,961 L110,961 C112.209,961 114,959.209 114,957 L114,953 C114,950.791 112.209,949 110,949 L110,949 Z"
                    id="grid"
                  ></path>
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>

      ${this.currentView === "table"
        ? this._renderTableView()
        : this._renderListView()}
      ${this._renderPagination()}

      <confirmation-modal
        .open="${!!this.employeeToDelete}"
        .employeeName="${this.employeeToDelete
          ? this.employeeToDelete.firstName
          : ""}"
        @confirm="${this._confirmDelete}"
        @close="${this._closeDeleteConfirmation}"
      ></confirmation-modal>
    `;
  }
}

customElements.define("employee-list-view", EmployeeListView);
