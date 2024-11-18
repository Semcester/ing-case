import store from "../store/store.js";
import { addEmployee } from "../store/store.js";
import { Router } from "@vaadin/router";

import { LitElement, html } from "lit";
import "../components/employee-form.js";
import { translate } from "../utils/i18n.js";

class EmployeeCreateView extends LitElement {
  _handleCreate(event) {
    try {
      const newEmployee = event.detail;

      store.dispatch(addEmployee(newEmployee));
      const toast = document.getElementById("toast");
      toast.show(translate("employeeAddedSuccess"), "success");

      Router.go("/");
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return html`
      <employee-form-view
        mode="create"
        @employee-created="${this._handleCreate}"
      ></employee-form-view>
    `;
  }
}

customElements.define("employee-create-view", EmployeeCreateView);
