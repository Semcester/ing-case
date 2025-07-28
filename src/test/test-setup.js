if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: { NODE_ENV: 'test' } };
}

console.log('[✅ TEST SETUP LOADED]');
