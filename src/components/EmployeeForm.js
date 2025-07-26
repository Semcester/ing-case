import { html, css } from 'lit';
import {store} from '../store/index'
import { BaseLocalizedElement } from './BaseLocalizedElement.js';
import { translate } from "../i18n/index";

export class EmployeeForm extends BaseLocalizedElement {
  static properties = {
    mode: { type: String },
    employee: { type: Object },
    _formData: { state: true },
    _errors: { state: true },
     _formError: { state: true },
  };

  constructor() {
    super();
    this.mode = 'create';
    this.employee = null;
    this._formData = this._getEmptyForm();
    this._errors = {};
    this._formError = '';
  }
  connectedCallback() {
  super.connectedCallback();
  document.addEventListener("language-changed", this._onLanguageChange);
}
disconnectedCallback() {
  document.removeEventListener("language-changed", this._onLanguageChange);
  super.disconnectedCallback();
}

_onLanguageChange = () => {

  if (Object.keys(this._errors).length > 0) {
    const prevErrors = { ...this._errors };
    const remappedErrors = {};

    for (const key in prevErrors) {
      switch (key) {
        case 'firstName':
          remappedErrors[key] = translate('firstNameRequired', this.currentLang);
          break;
        case 'lastName':
          remappedErrors[key] = translate('lastNameRequired', this.currentLang);
          break;
        case 'email':
          remappedErrors[key] = translate('invalidEmail', this.currentLang);
          break;
        case 'phone':
          remappedErrors[key] = translate('invalidPhone', this.currentLang);
          break;
        case 'position':
          remappedErrors[key] = translate('positionRequired', this.currentLang);
          break;
        case 'department':
          remappedErrors[key] = translate('departmentRequired', this.currentLang);
          break;
        case 'dateOfBirth':
          remappedErrors[key] = translate('dateOfBirthRequired', this.currentLang);
          break;
        case 'dateOfEmployment':
          remappedErrors[key] = translate('dateOfEmploymentRequired', this.currentLang);
          break;
      }
    }

    this._errors = remappedErrors;
  }

  if (this._formError === translate('duplicateRecord', this.currentLang === 'en' ? 'tr' : 'en')) {
    this._formError = translate('duplicateRecord', this.currentLang);
  }

  this.requestUpdate();
};


  updated(changedProps) {
    if (changedProps.has('employee') && this.employee) {
      this._formData = { ...this.employee };
    } else if (changedProps.has('employee') && !this.employee) {
      this._formData = this._getEmptyForm();
    }
  }

  _getEmptyForm() {
    return {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      dateOfEmployment: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
  }

  _onInput(e) {
  const { name, value } = e.target;
  this._formData = { ...this._formData, [name]: value };

  const newErrors = { ...this._errors };

  switch (name) {
    case 'firstName':
      if (!value) newErrors.firstName = translate('firstNameRequired', this.currentLang);
      else delete newErrors.firstName;
      break;
    case 'lastName':
      if (!value) newErrors.lastName = translate('lastNameRequired', this.currentLang);
      else delete newErrors.lastName;
      break;
    case 'email':
      if (!value || !/^\S+@\S+\.\S+$/.test(value)) newErrors.email = translate('invalidEmail', this.currentLang);
      else delete newErrors.email;
      break;
    case 'phone':
      if (!value || !/^[0-9]{10,15}$/.test(value)) newErrors.phone = translate('invalidPhone', this.currentLang);
      else delete newErrors.phone;
      break;
    case 'position':
      if (!value) newErrors.position = translate('positionRequired', this.currentLang);
      else delete newErrors.position;
      break;
    case 'department':
      if (!value) newErrors.department = translate('departmentRequired', this.currentLang);
      else delete newErrors.department;
      break;
    case 'dateOfBirth':
      if (!value) newErrors.dateOfBirth = translate('dateOfBirthRequired', this.currentLang);
      else delete newErrors.dateOfBirth;
      break;
    case 'dateOfEmployment':
      if (!value) newErrors.dateOfEmployment = translate('dateOfEmploymentRequired', this.currentLang);
      else delete newErrors.dateOfEmployment;
      break;
  }

  this._errors = newErrors;
  this._formError = '';
}


_validate() {
  const errors = {};
  const { firstName, lastName, email, phone, position, department, dateOfBirth, dateOfEmployment } = this._formData;

  if (!firstName) errors.firstName = translate('firstNameRequired', this.currentLang);
  if (!lastName) errors.lastName = translate('lastNameRequired', this.currentLang);
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = translate('invalidEmail', this.currentLang);
  if (!phone || !/^[0-9]{10,15}$/.test(phone)) errors.phone = translate('invalidPhone', this.currentLang);
  if (!position) errors.position = translate('positionRequired', this.currentLang);
  if (!department) errors.department = translate('departmentRequired', this.currentLang);
  if (!dateOfBirth) errors.dateOfBirth = translate('dateOfBirthRequired', this.currentLang);
  if (!dateOfEmployment) errors.dateOfEmployment = translate('dateOfEmploymentRequired', this.currentLang);

  this._errors = errors;
  return Object.keys(errors).length === 0;
}


  _onSubmit(e) {
  e.preventDefault();
  if (!this._validate()) return;

  const allEmployees = store.getState().employee.employees;
  const isDuplicate = allEmployees.some(emp =>
    emp.email === this._formData.email &&
    emp.phone === this._formData.phone &&
    this.mode === 'create' 
  );

  if (isDuplicate) {
    this._formError = translate('duplicateRecord', this.currentLang);
    return;
  }

  this._formError = '';
  this.dispatchEvent(
    new CustomEvent('form-submit', {
      detail: this._formData,
      bubbles: true,
      composed: true,
    })
  );
}


  _onCancel() {
    this.dispatchEvent(new CustomEvent('form-cancel', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <form @submit=${this._onSubmit}>
        <div class="form-grid">
          <label>
            ${translate("firstName",this.currentLang)}
            <input name="firstName" .value=${this._formData.firstName} @input=${this._onInput} />
            ${this._errors.firstName ? html`<span class="error">${this._errors.firstName}</span>` : ''}
          </label>

          <label>
            ${translate("lastName", this.currentLang)}
            <input name="lastName" .value=${this._formData.lastName} @input=${this._onInput} />
             ${this._errors.lastName ? html`<span class="error">${this._errors.lastName}</span>` : ''}
          </label>

          <label>
             ${translate("dateOfEmployment", this.currentLang)}
            <input type="date" name="dateOfEmployment" .value=${this._formData.dateOfEmployment} @input=${this._onInput} />
             ${this._errors.dateOfEmployment ? html`<span class="error">${this._errors.dateOfEmployment}</span>` : ''}
          </label>

          <label>
            ${translate("dateOfBirth", this.currentLang)}
            <input type="date" name="dateOfBirth" .value=${this._formData.dateOfBirth} @input=${this._onInput} />
             ${this._errors.dateOfBirth ? html`<span class="error">${this._errors.dateOfBirth}</span>` : ''}
          </label>

          <label>
              ${translate("phone", this.currentLang)}
            <input name="phone" .value=${this._formData.phone} @input=${this._onInput} />
             ${this._errors.phone ? html`<span class="error">${this._errors.phone}</span>` : ''}
          </label>

          <label>
            ${translate("email", this.currentLang)}
            <input name="email" .value=${this._formData.email} @input=${this._onInput} />
            ${this._errors.email ? html`<span class="error">${this._errors.email}</span>` : ''}
          </label>

          <label>
            ${translate("department", this.currentLang)}
           <select name="department" .value=${this._formData.department} @change=${this._onInput}>
            <option value="">${translate("pleaseSelect", this.currentLang)}</option>
            <option value="Analytics">Analytics</option>
            <option value="Tech">Tech</option>
          </select>
           ${this._errors.department ? html`<span class="error">${this._errors.department}</span>` : ''}
          </label>

          <label>
             ${translate("position", this.currentLang)}
            <select name="position" .value=${this._formData.position} @change=${this._onInput}>
              <option value="">${translate("pleaseSelect", this.currentLang)}</option>
              <option>Junior</option>
              <option>Medior</option>
              <option>Senior</option>
            </select>
             ${this._errors.position ? html`<span class="error">${this._errors.position}</span>` : ''}
          </label>
        </div>

        <div class="button-row">
          <button type="submit" class="primary">${translate("saveButton", this.currentLang)}</button>
          <button type="button" class="secondary" @click=${this._onCancel}>${translate("cancelButton", this.currentLang)}</button>
        </div>

        ${this._formError
  ? html`<div class="form-error">${this._formError}</div>`
  : ''}
      </form>
    `;
  }

  static styles = css`
form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

.form-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

input,
select {
  padding: 0.5rem;
  font-size: 1rem;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.primary {
  background: #ff6600;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
}

.secondary {
  background: transparent;
  color: #ff6600;
  border: 1px solid orange;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 0.8rem;
}
  .form-error {
  background-color: #ffe5e5;
  color: #c00;
  padding: 0.75rem 1rem;
  border: 1px solid #c00;
  border-radius: 6px;
  margin-top:1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}
  `;
}

customElements.define('employee-form', EmployeeForm);
