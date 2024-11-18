import { Router } from "@vaadin/router";
import { LitElement, html } from "lit";
import { translate } from "../utils/i18n.js";

import { updateEmployee } from "../store/store.js";

import store from "../store/store.js";
import "../components/employee-form.js";

class EmployeeEditView extends LitElement {
  static get properties() {
    return {
      employee: { type: Object },
    };
  }
  constructor() {
    super();
    this.employee = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const state = store.getState();
    this.employee = state.employees.selectedEmployee;

    if (!this.employee) {
      Router.go("/");
    }
  }

  _handleUpdate(event) {
    try {
      const updatedEmployee = event.detail;
      store.dispatch(updateEmployee(updatedEmployee));
      const toast = document.getElementById("toast");
      toast.show(translate("employeeUpdatedSuccess"), "success");
      Router.go("/");
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (!this.employee) {
      return html`<p>${translate("employeeNotFound")}</p>`;
    }

    return html`
      <employee-form-view
        mode="edit"
        .employee="${this.employee}"
        @employee-updated="${this._handleUpdate}"
      ></employee-form-view>
    `;
  }
}

customElements.define("employee-edit-view", EmployeeEditView);
