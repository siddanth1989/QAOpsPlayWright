import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
await page.goto("https://rahulshettyacademy.com/angularpractice/");
//identifying locators based on label
await page.getByLabel("Check me out if you Love IceCreams!").click();
await page.getByLabel("Employed").check(); //Alternative for Click. Check can be used for radiobuttons and checkboxes
await page.getByLabel("Gender").selectOption("Male"); //Since its clicking radiobutton can use getbylabel
await page.getByPlaceholder("Password").fill("abc123"); //placeholder can be used to fill/type inside an input field
await page.getByRole("button",{name: 'Submit'}).click(); //to use buttons . make sure its unique
await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
 //get text and use assertion to confirm
await page.getByRole("link",{name: 'Shop'}).click();
//search for app cards and then look for specific item and look for the button and click
//chaining locators to add item to cart
await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
});