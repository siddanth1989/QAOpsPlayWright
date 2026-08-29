const { test, expect } = require('@playwright/test');

test('Client Application Using Get By Locators', async ({ page }) => {
   const email = "siddanth1989@gmail.com";
   const productName = "iphone 13 pro";
   const products = page.locator(".card-body");

   await page.goto("https://rahulshettyacademy.com/client");
   //GOAL TO AVOID css locators and use getby or filters
   //no association to use getbylabel
   await page.getByPlaceholder("email@example.com").fill(email); 
   await page.getByPlaceholder("enter your passsword").fill("#Rohit45"); 
   //no placeholder for this button, can use getbyrole
   await page.getByRole('button',{name: 'login'}).click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body h5").first().waitFor();

   //can use filter to get the specific item in all 3 cards 
   //can use chaining locators instead of using different locators in different lines
   await page.locator(".card-body").filter({hasText: "ZARA COAT 3"}).getByRole('button',{name: 'Add to Cart'}).click();
   
   //button is not unique hence go to the parent tag of button which is li, search list items and then go inside button with name cart

   await page.getByRole("listitem").getByRole('button',{name: 'Cart'}).click();

    //no alternative for wait methods
   await page.locator("div li").last().waitFor(); 
   await expect(page.getByText("ZARA COAT 3")).toBeVisible(); //can use get by text directly and use assertion  
   await page.getByRole("button", {name:'Checkout'}).click();  
   await page.getByPlaceholder("Select Country").pressSequentially("Ind");
   await page.getByRole("button",{name: "India"}).nth(1).click(); //0 element is British Indian, 1 element is India
   await page.getByText("PLACE ORDER").click();
   await expect(page.getByText("Thankyou for the order.")).toBeVisible();
});

