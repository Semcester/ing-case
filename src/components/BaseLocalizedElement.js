import { LitElement } from 'lit';
import { store } from '../store/index.js';

export class BaseLocalizedElement extends LitElement {
  get currentLang() {
    return store.getState().localization.currentLang;
  }
}
