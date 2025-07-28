import { LitElement, html, css } from "lit";
import { ING_LOGO, EN_FLAG, TR_FLAG,EMPLOYEE_ICON,ADDNEW_ICON } from "../contants/index.js";
import {store} from '../store/index.js'
import {setLanguage} from '../store/localizationStore.js'

import { translate } from "../i18n/index";

class NavigationMenu extends LitElement {
  static properties = {
    currentLang: { type: String },
    isOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.currentLang = "en";
    this.isOpen = false;
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._handleOutsideClick);
    document.addEventListener("language-changed", this._handleLanguageChange);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._handleOutsideClick);
    document.removeEventListener("language-changed", this._handleLanguageChange);
    super.disconnectedCallback();
  }

  _handleOutsideClick(event) {
    if (!this.shadowRoot) return;
    const dropdown = this.shadowRoot.querySelector(".language-dropdown");
    if (dropdown && !dropdown.contains(event.target)) {
      this.isOpen = false;
    }
  }
  _handleLanguageChange = () => {
  this.requestUpdate();
};

  toggleDropdown(e) {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  changeLanguage(lang) {
  this.currentLang = lang;
  this.isOpen = false;
  store.dispatch(setLanguage(lang));
  document.dispatchEvent(new CustomEvent("language-changed"));
  }

  render() {
    return html`
      <nav>
        <div class="nav-left">
          <div class="logo-container">
            <a href="/" class="logo-navigate">
              ${ING_LOGO()}
              <h4>ING</h4>
            </a>
          </div>
        </div>
        <div class="nav-right">
          <div>
            <a class="btn-container" href="/">
            ${EMPLOYEE_ICON()}
            ${translate("employees", this.currentLang)}
          </a>
          </div>
          <div>
            <a class="btn-container" href="/employee/new">
          ${ADDNEW_ICON()}
          ${translate("addNew", this.currentLang)}
          
        </a>
          </div>

          <div class="language-dropdown ${this.isOpen ? "open" : ""}">
            <div class="selected-lang" @click="${this.toggleDropdown}">
              ${this.currentLang === "tr" ? TR_FLAG() : EN_FLAG()}
            </div>
            <div class="dropdown-content">
              <a @click="${() => this.changeLanguage("tr")}">
                ${TR_FLAG()} Turkish
              </a>
              <a @click="${() => this.changeLanguage("en")}">
                ${EN_FLAG()} English
              </a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      background-color: #ffffff;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .nav-left img {
      height: 32px;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-right a {
      text-decoration: none;
      color: #ff6600;
      font-weight: bold;
      font-size: 14px;
    }

    .language-dropdown {
      position: relative;
      display: inline-block;
    }

    .selected-lang {
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      padding:0.5rem;
      right: 0;
      background-color: #ffffff;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      z-index: 1;
    }

    .language-dropdown.open .dropdown-content {
      display: block;
    }

    .dropdown-content a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #ff6600;
      font-weight: bold;
      font-size: 0.9rem;
      white-space: nowrap;
      cursor: pointer;
    }

    .dropdown-content a:hover {
      background-color: #f8f8f8;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-container {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .logo-navigate {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: inherit;
    }

    .flag-icon {
      width: 2rem;
      height: auto;
      object-fit: contain;
    }
  `;
}

customElements.define("navigation-menu", NavigationMenu);
