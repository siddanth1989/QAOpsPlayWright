const {expect} = require('@playwright/test');
const {customtest}  = require("./utils/test-base.js"); //importing our custom test base, test is not required now in above statement
const {POManager} = require('../pageobjects/POManager.js');
const test = require('node:test'); 
customtest(`Client App login`, async ({page, testDataForOrder }) => { //pass the fixture beside page as an arugment
   //js file- Login js, DashboardPage, checkout, placeorder
   // JS Files code
   const poManager = new POManager(page);
   //Data passed through JSON file
   const products = page.locator(".card-body");
   const dropdowns = page.locator(".ta-results");
   const loginPage = poManager.getLoginPage();
   await loginPage.goTo();
   await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password);
   const dashboardPage = poManager.getDashboardPage();
   await dashboardPage.searchProductAddCart(testDataForOrder.productName);
   await dashboardPage.navigateToCart();
   const checkOutPage = poManager.getCheckOutPage();
   await checkOutPage.verifyProductCheckout(testDataForOrder.productName);
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
