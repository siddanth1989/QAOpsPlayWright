//Login UI -> .json
//test browser -> .json(inject json file),cart,order,orderdetails,orderhistory 
const { test, expect } = require('@playwright/test'); 
let webContext; //create global context to access it everywhere

test.beforeAll(async({browser})=>
{
   const context = await browser.newContext(); //store context in a variable to inject later
   const page = await context.newPage();
   const email = "siddanth1989@gmail.com";
    await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("#Rohit45");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');

   context.storageState({path: 'state.json'}); //storage above steps in a jason file 
   webContext = await browser.newContext({storageState:'state.json'});
})
 
test('@Client Application End to End', async () => {  //no need to pass page as fixture since page is created dynamically
   const email = "siddanth1989@gmail.com";
   const productName = "iphone 13 pro";

   //use web context here and create page
   const page  = await webContext.newPage();

   await page.goto("https://rahulshettyacademy.com/client"); //page will already be logged in here because of context
   const products = page.locator(".card-body");
   const titles = await page.locator(".card-body h5").allTextContents();
   console.log(titles); 

   
   
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

   // 1. Clean the orderId variable to remove the pipes and spaces
   const cleanedorderId = orderId.replace(/\|/g, "").trim();
   console.log("Order Id for Product", productName, "is:", cleanedorderId);
 
   //ASSIGNMENT

   // 1. to go to orders
   // 2. find the order id through the loop with iterations
   // 3. click view button 
   // 4. Verify Details
   await page.locator("button[routerlink*='myorders']").click();
   const orders = await page.locator(".table");
   await orders.first().waitFor();
   //search locator only inside table headers and store the count of number of results
   const ordersCount = await orders.locator(".ng-star-inserted th").count();
   const buttons = orders.locator(".btn.btn-primary:has-text('View')");
   //loop through until you find desired order
   for(let j=0; j<ordersCount; j++)
   {
    //get table header value at each index and store in a variable
    const orderValue = await orders.locator(".ng-star-inserted th").nth(j).textContent();
    
    if (orderValue == cleanedorderId) //check for exact id, Use text.trim() if you dont want to use space. 
    {
        //click on that view button once orderid matches
        await buttons.nth(j).click();
        break; //to come out of the loop once value is selected
    }
   }

   //Order History Page
   
   //Wait for the div to load for
   const emailwrap = page.locator(".email-wrapper.ng-star-inserted");
   await emailwrap.first().waitFor();
   //1. Verify Thank you message
   const thq = page.locator(".tagline");
   await expect(thq).toBeVisible();
   await thq.highlight();
    // This pauses execution, making it look like it's stuck if the click didn't happen.
   await page.pause();
   //Verify Order Summary title
   const os = page.locator(".email-title");
   await expect(os).toBeVisible();  
   await os.highlight();
   //2. Verify if ordervalue displayed in this page is equal to order id from placed order
   const orderhId = page.locator(".col-text.-main");
   const orderhvalue = await orderhId.textContent();
   if(orderhvalue == cleanedorderId)
   {
      console.log("Order Id in Order History is verified");;
      //Highlight the value
      await orderhId.highlight();
   }
   //3. Verify Delivery Address title
   // Define the "Box" once. 
   // This finds the specific address container for Delivery.
   const deliveryBox = page.locator(".address").filter({ hasText: "Delivery Address" });
   await expect(deliveryBox.locator(".content-title")).toBeVisible();
   await deliveryBox.locator(".content-title").highlight();

   // 3. Verify Email (Search inside the box)
   // .trim() handles those spaces you saw in the inspector
   const emailLoc = deliveryBox.locator("p").filter({ hasText: email.trim() });
   await expect(emailLoc).toBeVisible();
   await emailLoc.highlight();

   // 4. Verify Country (Search inside the box)
   const countryLoc = deliveryBox.locator("p").filter({ hasText: " Country - India " });
   await expect(countryLoc).toBeVisible();
   await countryLoc.highlight();

   //Verify Product Ordered Title
   const pt = page.locator(".content-title.-centered");
   await expect(pt).toBeVisible(); 
   await pt.highlight();
   //2. Verify if product name displayed in this page is equal to product name from home page
   const productNameBox = page.locator(".artwork-card-info .title");
   const productNameO = await productNameBox.textContent();
   if(productNameO.trim() == productName)
   {
      console.log("Product Name in Order History is verified");
      //Highlight the value
      await productNameBox.highlight();
   }


   // This pauses execution, making it look like it's stuck if the click didn't happen.
   await page.pause();
   
});

test('@API Test Case 2', async () => {  //no need to pass page as fixture since page is created dynamically
   const email = "siddanth1989@gmail.com";
   const productName = "iphone 13 pro";

   //use web context here and create page
   const page  = await webContext.newPage();

   await page.goto("https://rahulshettyacademy.com/client"); //page will already be logged in here because of context
   const products = page.locator(".card-body");
   const titles = await page.locator(".card-body h5").allTextContents();
   console.log(titles); 
})