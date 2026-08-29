const {test,expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');
const loginPayLoad = {userEmail: "siddanth1989@gmail.com", userPassword: "#Rohit45"};
const orderPayLoad = {orders: [{country: "Australia", productOrderedId: "6960ea76c941646b7a8b3dd5"}]};
const fakePayLoadOrders = {data:[],message:"No Orders"};
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
   //mock the orders page with route where we require it to
//    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/692a9a9b5008f6a9094182f9");
   await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", // * ->to accept anything, not just particular order
    async route=>
    {
        //real response - turning page(browser) mode to api mode-> stored in variable
        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayLoadOrders); //convert to Json
        //giving fake response to browser
        route.fulfill(
            {
                response,
                body,        //overwriting the response with the fake response)

            });
        //intercepting response - API response->{playwright fakeresponse}browser->render data on front end
    });
   await page.locator("button[routerlink*='myorders']").click();
   //put wait for response to avoid the error for response delay at the end for text content
//    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/692a9a9b5008f6a9094182f9"); 
   await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"); // * -> to accept anything, not just particular order
    // await page.pause();
//    await page.locator("tbody").waitFor();  
//    const rows = await page.locator("tbody tr");
   console.log(await page.locator(".mt-4").textContent()); //response is delayed by getting back as we are immediately overwriting the browser message even if it appeared
});