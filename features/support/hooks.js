const playwright = require('@playwright/test');
const { POManager } = require('../../pageobjects/POManager')
const { Before, After, BeforeStep, AfterStep, Status } = require('@cucumber/cucumber');

Before( async function () {
    //common steps in all cases to launch browser hence put in hooks.js
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page); //creating the object of the POManager to increase the scope globally and to use it in other steps  
});

After(async function () {
    //Assuming this.driver is a selenium WebDriver instance
    console.log("I am the last to execute");
});

BeforeStep(function () {
    // This hook will be executed before all steps in a scenario with tag @foo
});

AfterStep(async function ({ result }) {
    // This hook will be executed after all steps, and take a screenshot on step failure. result is captured(Pass and Fail)
    if (result.status === Status.FAILED) {
        await this.page.screenshot({ path: 'failed-step1.png' });
    }
});