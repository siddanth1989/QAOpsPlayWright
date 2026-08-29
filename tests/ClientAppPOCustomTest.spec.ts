import { test, expect } from '@playwright/test';
import {customTest} from './utils_ts/test-base';
import {POManager} from '../pageobjects_ts/POManager';
import { LoginPage } from '../pageobjects_ts/LoginPage';
import { DashboardPage } from '../pageobjects_ts/DashboardPage';
import { CheckOutPage } from '../pageobjects_ts/CheckOutPage';
import { PlaceOrderPage } from '../pageobjects_ts/PlaceOrderPage';   

test('@Web Client App login', async ({ page }) => {
   const username = "anshika@gmail.com";
   const password = "Iamking@000";
   const productName = 'ZARA COAT 3';
   const dropdowns = page.locator(".ta-results");

   // --- Page Object Orchestration ---
   const loginPage = new LoginPage(page);
   await loginPage.goTo();
   await loginPage.validLogin(username, password);

   const dashboardPage = new DashboardPage(page);
   await dashboardPage.searchProductAddCart(productName);
   await dashboardPage.navigateToCart();

   const checkOutPage = new CheckOutPage(page);
   await checkOutPage.verifyProductCheckout(productName);

   const Order = new PlaceOrderPage(page);
   await Order.verifyDetails(dropdowns);
   await Order.placeOrder(); // 🌟 Order gets placed here!

   // --- Post-Order Assertions & Verification (Duplicates Removed) ---
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   let orderId: any;
   orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(`Generated Order ID: ${orderId}`);

   // --- Order History Tracking ---
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");

   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }

   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
});

customTest(`Client App login`, async ({page, testDataForOrder }) => { //pass the fixture beside page as an arugment
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
   let orderId: any;
   orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
});
