import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { translate } from "../i18n/index";
import {store} from '../store/index.js'
import { BaseLocalizedElement } from '../components/BaseLocalizedElement.js';
import { deleteEmployee } from '../store/employeeStore.js';
import { selectEmployee } from '../store/employeeStore.js';
import {LIST_VIEW,GRID_VIEW} from '../contants/index.js';
import '../components/EmployeeTable.js';
import '../components/EmployeeCardList.js';
import '../components/Pagination.js';
import '../components/SearchBar.js';


export class EmployeeListPage extends BaseLocalizedElement {
  static properties = {
    page: { type: Number },
    search: { type: String },
    _employees: { state: true },
    _viewMode: { state: true },
    _totalPages: { state: true },
    _showConfirm: { state: true },
  };

  constructor() {
    super();
    this.page = 1;
    this.search = '';
    this._employees = [];
    this._viewMode = 'list';
    this._showConfirm = false;
    this._employeeToDelete = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateList();
    this.unsubscribe = store.subscribe(() => this._updateList());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  _updateList() {
    const all = store.getState().employee.employees;
    const filtered = this.search
      ? all.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(this.search.toLowerCase())
      )
      : all;


    const perPage = this._viewMode === 'list' ? 10 : 4;
    const start = (this.page - 1) * perPage;
    const end = start + perPage;

    this._employees = filtered.slice(start, end);
    this._totalPages = Math.ceil(filtered.length / perPage);
  }

  _onSearchChange(e) {
    this.search = e.detail;
    this.page = 1;
    this._updateList();
    history.pushState(null, '', `/employees/page/1?search=${encodeURIComponent(this.search)}`);
  }

  _onPageChange(e) {
    this.page = e.detail;
    this._updateList();
    history.pushState(null, '', `/employees/page/${this.page}?search=${encodeURIComponent(this.search)}`);
  }

  _onEdit(e) {
    const data = e.detail;
    store.dispatch(selectEmployee(data));
    Router.go(`/employees/edit/${data.id}`);
  }
  _onDelete(e) {
  const id = e.detail.id;
  const all = store.getState().employee.employees;
  const found = all.find(emp => emp.id === id);
  this._employeeToDelete = found;
  this._showConfirm = true;
}

    _handleConfirm(e) {
  const id = e.detail.id;
  store.dispatch(deleteEmployee(id));
  this._employeeToDelete = null;
  this._showConfirm = false;
}

_handleCancel() {
  this._employeeToDelete = null;
  this._showConfirm = false;
}

  _toggleView(mode) {
  this._viewMode = mode;
  this.page = 1;
  this._updateList();
}

  render() {
    return html`
      <div class="header-row">
        <div class="left">
          <span class="title">${translate("employeeListTitle", this.currentLang)}</span>
          <search-bar .value=${this.search} @search-change=${this._onSearchChange}></search-bar>
        </div>

        <div class="view-toggle">
          <button class="icon-button ${this._viewMode === 'list' ? 'active' : ''}" @click=${() => this._toggleView('list')} title="List View">${LIST_VIEW()}</button>
          <button class="icon-button ${this._viewMode === 'grid' ? 'active' : ''}" @click=${() => this._toggleView('grid')} title="Grid View">${GRID_VIEW()}</button>
        </div>
      </div>
      ${this._viewMode === 'list'
  ? html`<employee-table
      .employees=${this._employees}
      @edit-employee=${this._onEdit}
      @delete-employee=${this._onDelete}>
    </employee-table>`
  : html`<employee-card-list
      .employees=${this._employees}
      @edit-employee=${this._onEdit}
      @delete-employee=${this._onDelete}>
    </employee-card-list>`
}

    <div class="pagination">
      <pagination-component
        .current=${this.page}
        .total=${this._totalPages}
        @page-change=${this._onPageChange}>
      </pagination-component>
      </div>
            <confirm-dialog
        .open=${this._showConfirm}
        .employee=${this._employeeToDelete}
        @confirm=${this._handleConfirm}
        @cancel=${this._handleCancel}>
      </confirm-dialog>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .title {
    font-weight: bold;
    color: #ff6600;
    font-size: 1rem;
  }

  search-bar {
    flex: none;
    position: relative;
    display: inline-block;
  }

  .view-toggle {
    display: flex;
    gap: 0.5rem;
  }

  .icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1.25rem; /* SVG veya karakter tabanlı ikonlar için */
  line-height: 1;
}
  .icon-button svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: #333;
}
.icon-button.active svg {
  fill: #ff6600;
}

.pagination{

display:flex;
justify-content: center;
margin-top:20px;
}

  .icon-button:hover {
    background-color: #ffe5d0;
  }

  .icon-button.active {
    background-color: #ffe5d0;
  }
    input {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  vertical-align: middle; /* <-- bu kritik */
}
  `;
}

customElements.define('employee-list-page', EmployeeListPage);
