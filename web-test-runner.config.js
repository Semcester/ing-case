// web-test-runner.config.js
import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: './src/test/**/*.test.js',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
  plugins: [
    esbuildPlugin({
      ts: false,
      target: 'auto',
      define: {
        'process.env.NODE_ENV': '"test"',
      }
    }),
  ],
  setupFiles: ['./src/test/test-setup.js'],


  testFramework: {
    config: {
      ui: 'tdd',
      timeout: '5000',
    },
  },
};
