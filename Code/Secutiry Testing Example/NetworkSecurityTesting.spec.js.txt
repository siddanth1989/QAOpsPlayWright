const { test, expect } = require('@playwright/test');

test('Security test request intercept', async ({ page }) => {
    //login and reach orders page
    const email = "siddanth1989@gmail.com";
    const productName = "iphone 13 pro";
    const products = page.locator(".card-body");

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("#Rohit45");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body h5").first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();

    //keep an eye on this URL pattern to hold on and intercept and replace the request url with new order id 

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6" }))
    //continue method - intercepts request calls and overrides 
    await page.locator("button:has-text('View')").first().click(); //out of n elements get me the first one
    // await page.pause(); 
    
    //unauthorized error

    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
})