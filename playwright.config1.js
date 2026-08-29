import { defineConfig, devices } from '@playwright/test';
import path from 'path';

require('dotenv').config({
  path: path.resolve(__dirname, 'tests', '.env')
});

const config = defineConfig({
  testDir: './tests',
  retries: 2,
  // workers: 3,
  testMatch: /.*\.spec\.js$/,
  timeout: 30 * 1000,


  // define specific browser config dynamically
  projects: [
    {
      name: 'safariexecution',      
      use: {
        browserName: 'webkit',
        headless: false,         
        screenshot: 'off',       
        trace: 'on',   
        ...devices['iPhone 15 Pro'],         
           },
    },
    {
      name: 'chromeexecution',      
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        headless: true,         
        screenshot: 'on',  
        video: 'retain-on-failure',    
        ignoreHTTPSErrors:true,
        permissions: ['geolocation'], 
        trace: 'on',  //generate logs
        // viewport: {width:720,height:720}          //view your browser in this dimensions 
           },
    },


  ],

  reporter: 'html',
});

export default config;