import { fixture, assert, oneEvent } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { translate } from './mock/i18n/index.js';
import './mock/component/confirm-dialog.js';

suite('ConfirmDialog (manual mock)', () => {
  const employeeMock = { id: 42, firstName: 'Semih', lastName: 'Senan' };

  test('Employee information is rendered correctly', async () => {
    const el = await fixture(html`
      <confirm-dialog
        .open=${true}
        .employee=${employeeMock}
        .currentLang=${'en'}
        .translateFn=${translate}
      ></confirm-dialog>
    `);
    const msg = el.shadowRoot.querySelector('.message');
    assert.include(msg.textContent, 'Semih');
    assert.include(msg.textContent, 'Senan');
  });

  test('when the proceed button is clicked, it throws a confirm event.', async () => {
    const el = await fixture(html`
      <confirm-dialog
        .open=${true}
        .employee=${employeeMock}
        .currentLang=${'en'}
        .translateFn=${translate}
      ></confirm-dialog>
    `);
    const btn = el.shadowRoot.querySelector('.proceed');
    setTimeout(() => btn.click());
    const event = await oneEvent(el, 'confirm');
    assert.deepEqual(event.detail, { id: 42 });
  });

  test('clicking the cancel button throws a cancel event.', async () => {
    const el = await fixture(html`
      <confirm-dialog
        .open=${true}
        .employee=${employeeMock}
        .currentLang=${'en'}
        .translateFn=${translate}
      ></confirm-dialog>
    `);
    const btn = el.shadowRoot.querySelector('.cancel');
    setTimeout(() => btn.click());
    const event = await oneEvent(el, 'cancel');
    assert.ok(event);
  });
});
