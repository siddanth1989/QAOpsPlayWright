const {test, expect} = require('@playwright/test');
// const {customtest}  = require("./utils/test-base.js"); //importing our custom test base, test is not required now in above statement
const {POManager} = require('../pageobjects/POManager');
//use json parse method to convert json to js object
//Json->string->js object
const dataset =   JSON.parse(JSON.stringify(require("./utils/placeorderTestData.json")));   //import json file where data is stored

//for array of multiple datasets, use for loop
for(const data of dataset)
 {
 //loads data for each iteration
 //It-1 - dataset 1
 //it-2 - dataset 2
 
test(`Client App login ${data.productName}`, async ({ page }) => {
   //js file- Login js, DashboardPage, checkout, placeorder
   // JS Files code
   const poManager = new POManager(page);
   //Data passed through JSON file
   const products = page.locator(".card-body");
   const dropdowns = page.locator(".ta-results");
   const loginPage = poManager.getLoginPage();
   await loginPage.goTo();
   await loginPage.validLogin(data.username,data.password);
   const dashboardPage = poManager.getDashboardPage();
   await dashboardPage.searchProductAddCart(data.productName);
   await dashboardPage.navigateToCart();
   const checkOutPage = poManager.getCheckOutPage();
   await checkOutPage.verifyProductCheckout(data.productName);
   // const Order = poManager.getPlaceOrderPage();
   // await Order.verifyDetails(dropdowns);
   // await Order.placeOrder();
   const ordersReviewPage = poManager.getOrdersReviewPage();
   await ordersReviewPage.searchCountryAndSelect("ind","India");
   const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

});
}