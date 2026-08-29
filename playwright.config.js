const { defineConfig } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'tests', '.env') });

const config = defineConfig({
  testDir: './tests',
  testIgnore: [
    '**/PlayWrightAutomation Tutor Code/**',
    '**/playwright-migration-fox/**',
    '**/Code/**',
  ],
  testMatch: /.*\.spec\.js$/,
  timeout: 30 * 1000,

  use: {
    browserName: 'chromium',
    headless: true, // Required for Azure Linux cloud containers
    screenshot: 'on',
    trace: 'on',
    video: 'on',
  },

  projects: [
    {
      name: 'chromium',
    },
  ],

  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
});

module.exports = config;