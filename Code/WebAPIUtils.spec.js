const {test,expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');
const loginPayLoad = {userEmail: "siddanth1989@gmail.com", userPassword: "#Rohit45"};
const orderPayLoad = {orders: [{country: "Australia", productOrderedId: "6960ea76c941646b7a8b3dd5"}]};
let response;
test.beforeAll(async ()=>
{
    //Login API
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext,loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
})

test('API Place the order', async ({ page }) => 
    {
        await page.addInitScript(value =>
        {
            window.localStorage.setItem('token',value); //key value pair
        }, response.token);     
   await page.goto("https://rahulshettyacademy.com/client/");   
   await page.locator("button[routerlink*='myorders']").click();   
   await page.locator("tbody").waitFor();  
   const rows = await page.locator("tbody tr");
   for(let i=0;i< await rows.count();i++)
   {
    const roworderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(roworderId)) 
    
    {
        await rows.nth(i).locator("button").first().click();
        break;
    }
   }
   
   const orderIdDetails = await page.locator(".col-text").textContent();
   await page.pause();   
   expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
   
   
});