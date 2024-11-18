import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
    files: 'test/**/*.test.js',
    nodeResolve: true,
    browserStartTimeout: 60000,
    testFramework: {
        config: {
            timeout: 5000,
        },
    },
    browsers: [
        playwrightLauncher({ product: 'chromium' }),
    ],
};
