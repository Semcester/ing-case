import { html, css } from 'lit';
import { BaseLocalizedElement } from './base-localized-element.js';
import { translate } from "../../mock/i18n/index.js";

export class SearchBar extends BaseLocalizedElement {
  static properties = {
    value: { type: String },
  };

  constructor() {
    super();
    this.value = '';
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
    this.requestUpdate(); 
  };

  _onInput(e) {
    const newValue = e.target.value;
    this.value = newValue;
    this.dispatchEvent(new CustomEvent('search-change', {
      detail: newValue,
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <input
        type="text"
        .value=${this.value}
        @input=${this._onInput}
        placeholder="${translate("searchPlaceholder",this.currentLang)}"
      />
    `;
  }

  static styles = css`
    input {
      width: 12rem;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      border-color: #ff6600;
      box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.3);
    }
  `;
}

customElements.define('search-bar', SearchBar);
