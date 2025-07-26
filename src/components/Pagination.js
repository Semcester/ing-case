import { LitElement, html, css } from 'lit';

export class Pagination extends LitElement {
  static properties = {
    current: { type: Number },
    total: { type: Number },
    maxVisible: { type: Number },
  };

  constructor() {
    super();
    this.current = 1;
    this.total = 1;
    this.maxVisible = 5;
  }

  _goTo(page) {
    if (page !== '...' && page !== this.current) {
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: page,
        bubbles: true,
        composed: true,
      }));
    }
  }

  _getPages() {
    const pages = [];
    const { current, total, maxVisible } = this;

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  render() {
    const pages = this._getPages();

    return html`
    <button
  class="nav-button"
  @click=${() => this._goTo(this.current - 1)}
  ?disabled=${this.current === 1}
>&lt;</button>

        ${pages.map((page) =>
          page === '...'
            ? html`<span class="ellipsis">...</span>`
            : html`
                <button
                  class=${this.current === page ? 'active' : ''}
                  @click=${() => this._goTo(page)}
                >${page}</button>
              `
        )}

      <button
  class="nav-button"
  @click=${() => this._goTo(this.current + 1)}
  ?disabled=${this.current === this.total}
>&gt;</button>
      </div>
    `;
  }

  static styles = css`
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin: 2rem auto 1rem;
    flex-wrap: wrap;
    text-align: center;
    width: fit-content;
  }

  button {
    background: none;
    border: none;
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 50%;
    color: black;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button.nav-button {
    color: #ff6600;
  }

  button.active {
    background-color: #ff6600;
    color: white;
    font-weight: bold;
  }

  button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .ellipsis {
    padding: 6px 10px;
    font-size: 14px;
    color: #aaa;
  }
`;

}

customElements.define('pagination-component', Pagination);
