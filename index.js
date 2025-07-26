import { LitElement, html, css } from 'lit';

class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 2rem;
      color: #333;
    }
  `;

  render() {
    return html`
      <h1>Welcome to ING HR App</h1>
    `;
  }
}

customElements.define('app-root', AppRoot);
