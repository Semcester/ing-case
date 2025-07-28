import { fixture, assert, oneEvent } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import './mock/component/pagination'; 

suite('Pagination Component', () => {
  test('component renders correctly with default properties', async () => {
    const el = await fixture(html`<pagination-component></pagination-component>`);
    assert.shadowDom.equal(
        el,
        `
        <button class="nav-button" disabled>&lt;</button>
        <button class="active">1</button>
        <button class="nav-button" disabled>&gt;</button>
        `
    );
  });

  test('renders correct number of pages for total <= maxVisible + 2', async () => {
    const el = await fixture(html`<pagination-component current="2" total="5"></pagination-component>`);
    assert.shadowDom.equal(
      el,
      `
      <button class="nav-button">&lt;</button>
      <button>1</button>
      <button class="active">2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
      <button class="nav-button">&gt;</button>
      `
    );
  });

  test('renders ellipsis correctly when total > maxVisible + 2', async () => {
    const el = await fixture(html`<pagination-component current="5" total="10" maxvisible="5"></pagination-component>`);
    assert.shadowDom.equal(
      el,
      `
      <button class="nav-button">&lt;</button>
      <button>1</button>
      <span class="ellipsis">...</span>
      <button>3</button>
      <button>4</button>
      <button class="active">5</button>
      <button>6</button>
      <button>7</button>
      <span class="ellipsis">...</span>
      <button>10</button>
      <button class="nav-button">&gt;</button>
      `
    );
  });

  test('prev button is disabled on the first page', async () => {
    const el = await fixture(html`<pagination-component current="1" total="5"></pagination-component>`);
    const prevButton = el.shadowRoot.querySelector('.nav-button');
    assert.isTrue(prevButton.disabled);
  });

  test('next button is disabled on the last page', async () => {
    const el = await fixture(html`<pagination-component current="5" total="5"></pagination-component>`);
    const nextButton = el.shadowRoot.querySelectorAll('.nav-button')[1];
    assert.isTrue(nextButton.disabled);
  });

  test('fires a page-change event when a page button is clicked', async () => {
    const el = await fixture(html`<pagination-component current="1" total="5"></pagination-component>`);
    const pageButton = el.shadowRoot.querySelectorAll('button')[2]; 

    setTimeout(() => {
      pageButton.click();
    });

    const event = await oneEvent(el, 'page-change');
    assert.equal(event.detail, 2);
  });

  test('fires a page-change event when prev button is clicked', async () => {
    const el = await fixture(html`<pagination-component current="3" total="5"></pagination-component>`);
    const prevButton = el.shadowRoot.querySelector('.nav-button');

    setTimeout(() => {
      prevButton.click();
    });

    const event = await oneEvent(el, 'page-change');
    assert.equal(event.detail, 2);
  });

  test('fires a page-change event when next button is clicked', async () => {
    const el = await fixture(html`<pagination-component current="3" total="5"></pagination-component>`);
    const nextButton = el.shadowRoot.querySelectorAll('.nav-button')[1];

    setTimeout(() => {
      nextButton.click();
    });

    const event = await oneEvent(el, 'page-change');
    assert.equal(event.detail, 4);
  });

  test('does not fire a page-change event when current page is clicked', async () => {
    const el = await fixture(html`<pagination-component current="2" total="5"></pagination-component>`);
    const currentPageButton = el.shadowRoot.querySelector('.active');

    let eventFired = false;
    el.addEventListener('page-change', () => {
      eventFired = true;
    });

    currentPageButton.click();
    await el.updateComplete; 

    assert.isFalse(eventFired);
  });
});