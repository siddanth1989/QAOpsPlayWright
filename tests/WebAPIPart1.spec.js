const {test,expect, request} = require('@playwright/test');
//javascript object storing payload informations
const loginPayLoad = {userEmail: "siddanth1989@gmail.com", userPassword: "#Rohit45"};
const orderPayLoad = {orders: [{country: "Australia", productOrderedId: "6960ea76c941646b7a8b3dd5"}]};
let token;
let orderId;
test.beforeAll(async ()=>
{
    //LOGIN API
    //new API context like page/browser context
     const apiContext = await request.newContext();
     //1.request post url in header of network tab
     //2.pass variables as payload in data section
     //3. Store the response in a variable
     const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",  //end point
     {
        data:loginPayLoad,
        timeout: 60000
     })
     //check if response is success or not
     //200,201
     expect(loginResponse.ok()).toBeTruthy();
     //grab the response body and store in an object
     const loginResponseJson = await loginResponse.json();
     //parse it using json editor and get the token and store it in a variable
     token = loginResponseJson.token;
     //print it in output
     console.log(token); //declare this globally so that it is accessible in all the tests

     //ORDER API
     const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",  //end point
     {
        data:orderPayLoad,
        headers: 
        {
            'Authorization': token, //token from login
            'Content-Type': 'application/json'
        },
     })
     const orderResponseJson = await orderResponse.json();
     console.log(orderResponseJson);
     orderId = orderResponseJson.orders[0];

});

test('@API Place the order', async ({ page }) => 
    {
        //function is taking an argument and setting it in token attribute
        //pass actual value as second argument
        await page.addInitScript(value =>
        {
            window.localStorage.setItem('token',value); //key value pair
        }, token);

        //commented out login scenario as we dont need it since we are storing token

    //    await page.goto("https://rahulshettyacademy.com/client");
    //    await page.locator("#userEmail").fill(email);
    //    await page.locator("#userPassword").fill("#Rohit45");
    //    await page.locator("[value='Login']").click();
    //    await page.waitForLoadState('networkidle');

    
    const email = "siddanth1989@gmail.com";
    const productName = "iphone 13 pro";

    //now pass the direct dashboard URL to check if we are already logged in

    await page.goto("https://rahulshettyacademy.com/client/");
    //order already created through API. So go to orders directly
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
   await page.pause();
   //write assertion
   //confirm order id in details page to that from placed order
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
   
   // This pauses execution, making it look like it's stuck if the click didn't happen.
   await page.pause();
   
});