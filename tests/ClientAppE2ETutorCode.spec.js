const { test, expect } = require('@playwright/test');

test('@Client Application End to End Tutor Code', async ({ page }) => {
   const email = "siddanth1989@gmail.com";
   const productName = "iphone 13 pro";
   const products = page.locator(".card-body");

   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("#Rohit45");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');

   await page.locator(".card-body h5").first().waitFor();
   
   // FIX 1: await the count() method
   const count = await products.count();
   console.log("Number of products found:", count);
   
   for(let i = 0; i < count; i++) {
    const text = await products.nth(i).locator("b").textContent();
    
    // Log the text to see exactly what Playwright is finding (helps debug mismatches)
    console.log(text);

    // Use .trim() to ignore extra spaces (e.g. " IPHONE 13 PRO " vs "IPHONE 13 PRO")
    if(text === productName) {
        // Ensure the locator matches the button text exactly or use :has-text
        await products.nth(i).locator("text= Add To Cart").click();
        break;
    }
   }
    //click cart 
    await page.locator("[routerlink*='cart']").click();
    //check if the elements in div and list are loaded - waitFor
    //have to wait for only one element since waitFor doesn't work for multiple elements
    await page.locator("div li").last().waitFor(); //we are using this since isVisible doesn't support Auto Wait
    //write a locator which searches whole box for the product we recently added and want to checkout
    //to find text elements which has h3 tag
    //to check visibility of that text/item
    //store it in a variable(return type true or false)
    const bool = await page.locator("h3:has-text('iphone 13 pro')").isVisible();
    //include assertion to see if its true
    expect(bool).toBeTruthy();   
    //click checkout
    await page.locator("text=Checkout").click();
   
  
   await page.locator('input[type="text"]').nth(1).fill("123");
   await page.locator('input[type="text"]').nth(2).fill("P Siddanth Reddy");
   //paste wont work since whole bunch text doesn't fetch results. so have to enter letter by letter. Use 
   await page.locator("[placeholder*='Select Country']").pressSequentially("Ind");

   //playwright inspector code to select india directly
//    await page.getByRole('button', { name: ' India' }).click();

   //tutor code 
   const dropdown = page.locator(".ta-results");
   //wait for those dropdowns to show up once we enter part of text like ind
   await dropdown.waitFor();
   //search locator only inside dropdowns box and store the count of number of options
   const optionsCount = await dropdown.locator("button").count();
   //loop through until you find desired option
   for(let i=0; i<optionsCount; i++)
   {
    //get text at each index and store in a variable
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text == " India") //check for exact name, here India has a space before it . Use text.trim() if you dont want to use space. 
    {
        //click on that option once matches
        await dropdown.locator("button").nth(i).click();
        break; //to come out of the loop once value is selected
    }
   }
   //assertions to verify email id which is greeyed out and since its first matching element we can use .first()
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);

     
   await page.locator('input[name="coupon"]').fill("rahulshettyacademy");
   await page.getByRole('button', { name: 'Apply Coupon' }).click();
   await page.getByText('* Coupon Applied').waitFor();
   //verify couple success text
   const coupon = await page.getByText('* Coupon Applied').isVisible();
   expect(coupon).toBeTruthy(); 

   //playwright inspector code to click place order
    //   await page.getByText('Place Order').click();

    //tutor code
     await page.locator(".action__submit").click();       

   //verify thank you message with assertion - my code
   await expect(page.locator("h1:has-text(' Thankyou for the order. ')")).toBeVisible();

   //tutor code
    // await  expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    //get order it text - my code
   const orderId = await page.locator("label.ng-star-inserted").textContent();
   //tutor code
//    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();

   
   console.log("Order Id for Product", productName, "is:", orderId);
 
   //ASSIGNMENT - Tutor Code

   // 1. to go to orders
   await page.locator("button[routerlink*='myorders']").click();
   //wait until table body is shown up
   await page.locator("tbody").waitFor();
   // 2. find the order id through the loop with iterations
   //Traverse from parent to child - tbody to tr here
   const rows = await page.locator("tbody tr");
   for(let i=0;i< await rows.count();i++)
   {
    //control on nth row and then go to particular header
    //Chaining locators
    //store in a variable
    const roworderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(roworderId)) 
    //no need to clean original order id as we are using includes. roworderid should be part of orderid
    {
        //select view button from the row and use index(first) to click specific button
        await rows.nth(i).locator("button").first().click();
        break;
    }
   }
   //Verify Details
   //store this order id in a variable
   const orderIdDetails = await page.locator(".col-text").textContent();
   //write assertion
   //confirm order id in details page to that from placed order
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
   
   // This pauses execution, making it look like it's stuck if the click didn't happen.
   await page.pause();
   
});