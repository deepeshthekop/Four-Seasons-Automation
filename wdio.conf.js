import { mkdir, writeFile } from 'node:fs/promises';
export const config = {
    async afterTest(test, context, { passed }) {
        if (passed) return;
        try {
            await mkdir('./artifacts', { recursive: true });
            await browser.saveScreenshot('./artifacts/failure.png');
            await writeFile('./artifacts/failure.html', await browser.getPageSource());
            await writeFile('./artifacts/failure.txt', `${await browser.getUrl()}\n${await $('body').getText()}`);
        } catch (error) {
            console.warn(`Could not capture failure diagnostics: ${error.message}`);
        }
    },
    runner: 'local',
    specs: ['./test/specs/**/*.e2e.js'],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': { args: ['--window-size=1440,1000', '--lang=en-US'] }
    }],
    logLevel: 'warn',
    bail: 0,
    baseUrl: 'https://www.fourseasons.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: { ui: 'bdd', timeout: 180000 }
};
