import { html, css } from 'lit';
import { store } from '../store/index.js';
import { Router } from '@vaadin/router';
import { translate } from "../i18n/index";
import { addEmployee, updateEmployee } from '../store/employeeStore.js';

import { BaseLocalizedElement } from '../components/BaseLocalizedElement.js';
import '../components/EmployeeForm.js';

export class EmployeeFormPage extends BaseLocalizedElement {
 

  static properties = {
    mode: { type: String },
    employeeId: { type: String },
    _employee: { state: true },
  };

  constructor() {
    super();
    this._employee = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    document.addEventListener("language-changed", this._onLanguageChange);

    if (path.startsWith('/employees/edit/')) {
      this.mode = 'edit';
      this.employeeId = path.split('/').pop();
      const allEmployees = store.getState().employee.employees;
      this._employee = allEmployees.find(emp => emp.id === this.employeeId) ?? null;
    } else {
      this.mode = 'create';
      this._employee = null;
    }
  }

  disconnectedCallback() {
    document.removeEventListener("language-changed", this._onLanguageChange);
    super.disconnectedCallback();
  }

  _onLanguageChange = () => {
    this.requestUpdate();
  };

  _onSubmit(e) {
    const data = e.detail;
    if (this.mode === 'edit') {
      store.dispatch(updateEmployee(data));
    } else {
      const newEmployee = { ...data, id: crypto.randomUUID() };
      store.dispatch(addEmployee(newEmployee));
    }
    Router.go('/');
  }

  _onCancel() {
    window.history.back();
  }

  render() {
    return html`
      <h2>${this.mode === 'edit' ? translate("employeeEditTitle", this.currentLang) : translate("employeeCreateTitle", this.currentLang)}</h2>
      <employee-form
        .mode=${this.mode}
        .employee=${this._employee}
        @form-submit=${this._onSubmit}
        @form-cancel=${this._onCancel}
      ></employee-form>
    `;
  }

   static styles = css`
    h2 {
      color: #ff6600;
      font-size: 1rem;
      margin-bottom: 2rem;
    }
  `;
}

customElements.define('employee-form-page', EmployeeFormPage);
