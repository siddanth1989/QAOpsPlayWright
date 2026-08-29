const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageobjects/LoginPage');
const { DashboardPage } = require('../pageobjects/DashboardPage');
const { CheckOutPage } = require('../pageobjects/CheckOutPage');
const { PlaceOrderPage } = require('../pageobjects/PlaceOrderPage');

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
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
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