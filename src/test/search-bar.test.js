import { fixture, assert, oneEvent } from '@open-wc/testing';
import { html } from 'lit/static-html.js';


import './mock/component/search-bar';

suite('SearchBar', () => {
  test('input is rendered correctly', async () => {
    const el = await fixture(html`<search-bar .value=${'test'}></search-bar>`);
    const input = el.shadowRoot.querySelector('input');
    assert.ok(input);
    assert.equal(input.value, 'test');
  });

  test('placeholder comes with the correct translation', async () => {
    const el = await fixture(html`<search-bar .value=${''}></search-bar>`);
    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.placeholder, 'searchPlaceholder_en');
  });

  test('fires a search-change event when the input changes', async () => {
    const el = await fixture(html`<search-bar .value=${''}></search-bar>`);
    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => {
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });

    const event = await oneEvent(el, 'search-change');
    assert.equal(event.detail, 'hello');
  });
});
