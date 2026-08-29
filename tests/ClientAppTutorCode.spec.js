const { test, expect } = require('@playwright/test'); 
 
test('@Web Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "siddanth1989@gmail.com";
   const productName = 'zara coat 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("#Rohit45");
   await page.locator("[value='Login']").click();
//    await page.waitForLoadState('networkidle');
   await page.locator(".card-body h5").first().waitFor();
   const titles = await page.locator(".card-body h5").allTextContents();
   console.log(titles); 
 
})