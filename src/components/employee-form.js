import { LitElement, html, css } from "lit";
import { translate } from "../utils/i18n.js";
import { Router } from "@vaadin/router";

import "./update-confirmation-modal.js";
class EmployeeFormView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 600px;
      margin-top: 2rem;
    }

    h2 {
      text-align: center;
      color: #ff6600;
      margin-bottom: 24px;
    }

    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    form > div {
      display: flex;
      flex-direction: column;
    }

    form > div.full-width {
      grid-column: span 2;
    }

    label {
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }

    input,
    select {
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #ff6600;
    }

    .btn-group {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      grid-column: span 2;
    }

    button {
      padding: 12px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .submit-btn {
      background-color: #ff6600;
      color: white;
    }

    .submit-btn:hover {
      background-color: #cc5200;
    }

    .cancel-btn {
      background-color: #f0f0f0;
      color: #333;
    }

    .cancel-btn:hover {
      background-color: #e0e0e0;
    }
  `;

  static get properties() {
    return {
      mode: { type: String },
      employee: { type: Object },
    };
  }

  constructor() {
    super();
    this.mode = "create";
    this.employee = {};
    this.showUpdateModal = false;
    this.pendingUpdateData = null;
  }

  _getCurrentDate() {
    const date = new Date();
    return date.toISOString().split("T")[0];
  }

  _handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const employeeData = {
      ...this.employee,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      dateOfEmployment: formData.get("dateOfEmployment"),
      dateOfBirth: formData.get("dateOfBirth"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      department: formData.get("department"),
      position: formData.get("position"),
    };

    if (this.mode === "create") {
      employeeData.id = Date.now();
      this.dispatchEvent(
        new CustomEvent("employee-created", { detail: employeeData }),
      );
      this._navigateToHome();
    } else {
      this.pendingUpdateData = employeeData;
      this.showUpdateModal = true;
      this.requestUpdate();
    }
  }

  _handleUpdateConfirm() {
    if (this.pendingUpdateData) {
      this.dispatchEvent(
        new CustomEvent("employee-updated", { detail: this.pendingUpdateData }),
      );
      const toast = document.getElementById("toast");
      toast.show(translate("employeeUpdatedSuccess"), "success");
      this._navigateToHome();
    }
  }

  _handleUpdateCancel() {
    this.showUpdateModal = false;
  }

  _navigateToHome() {
    Router.go("/");
  }

  render() {
    return html`
      <div class="form-container">
        <h2>
          ${this.mode === "create"
            ? translate("employeeCreateTitle")
            : translate("employeeEditTitle")}
        </h2>
        <form @submit="${this._handleSubmit}">
          <div>
            <label for="firstName">${translate("firstName")}</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              .value="${this.employee.firstName || ""}"
              required
            />
          </div>

          <div>
            <label for="lastName">${translate("lastName")}</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              .value="${this.employee.lastName || ""}"
              required
            />
          </div>

          <div>
            <label for="dateOfEmployment"
              >${translate("dateOfEmployment")}</label
            >
            <input
              type="date"
              id="dateOfEmployment"
              name="dateOfEmployment"
              .value="${this.employee.dateOfEmployment ||
              this._getCurrentDate()}"
              required
            />
          </div>

          <div>
            <label for="dateOfBirth">${translate("dateOfBirth")}</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              .value="${this.employee.dateOfBirth || ""}"
              required
            />
          </div>

          <div>
            <label for="phone">${translate("phone")}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              .value="${this.employee.phone || ""}"
              required
            />
          </div>

          <div>
            <label for="email">${translate("email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              .value="${this.employee.email || ""}"
              required
            />
          </div>

          <div>
            <label for="department">${translate("department")}</label>
            <select id="department" name="department">
              <option
                value="Analytics"
                ?selected="${this.employee.department === "Analytics"}"
              >
                ${translate("departmentAnalytics")}
              </option>
              <option
                value="Tech"
                ?selected="${this.employee.department === "Tech"}"
              >
                ${translate("departmentTech")}
              </option>
            </select>
          </div>

          <div>
            <label for="position">${translate("position")}</label>
            <select id="position" name="position">
              <option
                value="Junior"
                ?selected="${this.employee.position === "Junior"}"
              >
                ${translate("positionJunior")}
              </option>
              <option
                value="Medior"
                ?selected="${this.employee.position === "Medior"}"
              >
                ${translate("positionMedior")}
              </option>
              <option
                value="Senior"
                ?selected="${this.employee.position === "Senior"}"
              >
                ${translate("positionSenior")}
              </option>
            </select>
          </div>

          <div class="btn-group">
            <button type="submit" class="submit-btn">
              ${translate(
                this.mode === "create" ? "saveButton" : "updateButton",
              )}
            </button>
            <button
              type="button"
              class="cancel-btn"
              @click="${this._navigateToHome}"
            >
              ${translate("cancelButton")}
            </button>
          </div>
        </form>
        <update-confirmation-modal
          .open="${this.showUpdateModal}"
          .employeeName="${this.employee.firstName || ""}"
          @confirm-update="${this._handleUpdateConfirm}"
          @close="${this._handleUpdateCancel}"
        ></update-confirmation-modal>
      </div>
    `;
  }
}

customElements.define("employee-form-view", EmployeeFormView);
