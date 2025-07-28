import { html, css } from 'lit';
import {store} from '../store/index'
import { BaseLocalizedElement } from './BaseLocalizedElement.js';
import { translate } from "../i18n/index";

export class EmployeeForm extends BaseLocalizedElement {
  static properties = {
    mode: { type: String },
    _formData: { state: true },
    _errors: { state: true },
    _formError: { state: true },
  };

  constructor() {
    super();
    this.mode = 'create';
    this._formData = this._getEmptyForm();
    this._errors = {};
    this._formError = '';
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("language-changed", this._onLanguageChange);

    if (this.mode === 'edit') {
      const selected = store.getState().employee.selectedEmployee;
      this._formData = selected ? { ...selected } : this._getEmptyForm();
    }
  }

  disconnectedCallback() {
    document.removeEventListener("language-changed", this._onLanguageChange);
    super.disconnectedCallback();
  }

  _onLanguageChange = () => {
    const translateError = key => translate(key, this.currentLang);

    this._errors = Object.fromEntries(
      Object.entries(this._errors).map(([k]) => [k, translateError(k + 'Required')])
    );

    if (this._formError === translate('duplicateRecord', this.currentLang === 'en' ? 'tr' : 'en')) {
      this._formError = translate('duplicateRecord', this.currentLang);
    }

    this.requestUpdate();
  };

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
    this._validateField(name, value);
  }

  _validateField(name, value) {
    const newErrors = { ...this._errors };
    const required = !value;

    const validators = {
      email: () => !/^\S+@\S+\.\S+$/.test(value),
      phone: () => !/^[0-9]{10,15}$/.test(value),
    };

    if (required || (validators[name] && validators[name]())) {
      const key = (name === 'email' || name === 'phone') ? `invalid${name[0].toUpperCase() + name.slice(1)}` : `${name}Required`;
      newErrors[name] = translate(key, this.currentLang);
    } else {
      delete newErrors[name];
    }

    this._errors = newErrors;
    this._formError = '';
  }

  _validateAll() {
    const fields = Object.keys(this._getEmptyForm());
    fields.forEach(field => this._validateField(field, this._formData[field]));
    return Object.keys(this._errors).length === 0;
  }

  _onSubmit(e) {
    e.preventDefault();
    if (!this._validateAll()) return;

    const all = store.getState().employee.employees;
    const isDuplicate = all.some(emp =>
      emp.email === this._formData.email &&
      emp.phone === this._formData.phone &&
      this.mode === 'create'
    );

    if (isDuplicate) {
      this._formError = translate('duplicateRecord', this.currentLang);
      return;
    }

    this.dispatchEvent(new CustomEvent('form-submit', {
      detail: this._formData,
      bubbles: true,
      composed: true,
    }));
  }

  _onCancel() {
    this.dispatchEvent(new CustomEvent('form-cancel', {
      bubbles: true,
      composed: true,
    }));
  }

  render() {
  const field = (name, type = 'text', isSelect = false, options = []) => {
  const isError = !!this._errors[name];
  const errorClass = isError ? 'error-border' : '';

  return html`
    <label>
      ${translate(name, this.currentLang)}
      ${isSelect
        ? html`
          <select
            name=${name}
            class=${errorClass}
            .value=${this._formData[name]}
            @change=${this._onInput}
          >
            <option value="">${translate("pleaseSelect", this.currentLang)}</option>
            ${options.map(opt => html`<option value=${opt}>${opt}</option>`)}
          </select>
        `
        : html`
          <input
            type=${type}
            name=${name}
            class=${errorClass}
            .value=${this._formData[name]}
            @input=${this._onInput}
          />
        `}
      ${isError ? html`<span class="error">${this._errors[name]}</span>` : ''}
    </label>
  `;
  };

  return html`
    <form @submit=${this._onSubmit}>
      <div class="form-grid">
        ${field('firstName')}
        ${field('lastName')}
        ${field('dateOfEmployment', 'date')}
        ${field('dateOfBirth', 'date')}
        ${field('phone')}
        ${field('email')}
        ${field('department', 'text', true, ['Analytics', 'Tech'])}
        ${field('position', 'text', true, ['Junior', 'Medior', 'Senior'])}
      </div>

      <div class="button-row">
        <button type="submit" class="primary">${translate("saveButton", this.currentLang)}</button>
        <button type="button" class="secondary" @click=${this._onCancel}>${translate("cancelButton", this.currentLang)}</button>
      </div>

      ${this._formError ? html`<div class="form-error">${this._formError}</div>` : ''}
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
    .error-border {
      border-color: red !important;
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
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(38%) sepia(97%) saturate(2000%) hue-rotate(-20deg) brightness(100%) contrast(97%);
      cursor: pointer;
    }
  `;
}

customElements.define('employee-form', EmployeeForm);
