import { LitElement, html, css } from "lit";
import { setLanguage, translate } from "../utils/i18n.js";

class NavigationMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
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

    .selected-flag {
      height: 24px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border 0.3s;
    }

    .selected-flag:hover {
      border: 2px solid #ff6600;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      background-color: #ffffff;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      z-index: 1;
    }

    .dropdown-content img {
      height: 24px;
      padding: 8px;
      cursor: pointer;
    }

    .dropdown-content img:hover {
      background-color: #f8f8f8;
    }

    .language-dropdown:hover .dropdown-content {
      display: block;
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
  `;

  constructor() {
    super();
    this.currentLang = "en";
  }

  render() {
    const logoPath = new URL("../assets/ing.png", import.meta.url).href;
    const trFlag = new URL("../assets/tr.png", import.meta.url).href;
    const enFlag = new URL("../assets/en.png", import.meta.url).href;

    return html`
      <nav>
        <div class="nav-left">
          <div class="logo-container">
            <a href="/" class="logo-navigate"
              ><img src="${logoPath}" alt="Logo" />
              <h4>ING</h4></a
            >
          </div>
        </div>
        <div class="nav-right">
          <div>
            <a class="btn-container" href="/">
              <svg
                width="16px"
                height="16px"
                fill="#ff6600"
                version="1.1"
                viewBox="0 0 297 297"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m284.58 276.91h-30.892c-1.702-19.387-5.386-59.954-7.771-75.858-2.715-18.113-17.518-33.527-36.835-38.357l-20.107-5.027c-3.25 19.41-20.159 34.253-40.477 34.253s-37.227-14.843-40.477-34.253l-20.107 5.027c-19.317 4.829-34.121 20.244-36.835 38.357-2.385 15.904-6.069 56.471-7.771 75.858h-30.894c-5.546 0-10.043 4.497-10.043 10.043s4.497 10.043 10.043 10.043h272.16c5.546 0 10.043-4.497 10.043-10.043s-4.495-10.043-10.042-10.043zm-57.403 0h-14.06v-65.258h-129.24v65.258h-14.06v-72.288c0-3.883 3.147-7.03 7.03-7.03h143.3c3.883 0 7.03 3.147 7.03 7.03v72.288z"
                />
                <path
                  d="m148.5 114.63c27.103 0 48.125-35.753 48.125-66.509 0-29.235-18.891-48.125-48.125-48.125s-48.125 18.89-48.125 48.125c0 30.757 21.022 66.509 48.125 66.509z"
                />
                <path
                  d="m129.77 124.62c-0.053 7.43-1.516 17.95-8.265 25.567 0 14.883 12.107 27.681 26.991 27.681s26.991-12.798 26.991-27.681c-6.748-7.617-8.212-18.136-8.263-25.567-5.86 2.617-12.139 4.078-18.727 4.078-6.587 0-12.867-1.461-18.727-4.078z"
                />
              </svg>
              ${translate("employees")}</a
            >
          </div>
          <div>
            <a class="btn-container" href="/create">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#f60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12H20M12 4V20"
                  stroke="#f60"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >${translate("addNew")}
            </a>
          </div>
          <div class="language-dropdown">
            <img
              src="${this.currentLang === "tr" ? trFlag : enFlag}"
              alt="${this.currentLang === "tr" ? "Türkçe" : "English"}"
              class="selected-flag"
            />
            <div class="dropdown-content">
              <img
                src="${trFlag}"
                alt="Türkçe"
                @click="${() => this.changeLanguage("tr")}"
              />
              <img
                src="${enFlag}"
                alt="English"
                @click="${() => this.changeLanguage("en")}"
              />
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  changeLanguage(lang) {
    this.currentLang = lang;
    setLanguage(lang);
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("language-changed", () => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("language-changed", () =>
      this.requestUpdate(),
    );
  }
}

customElements.define("navigation-menu", NavigationMenu);
