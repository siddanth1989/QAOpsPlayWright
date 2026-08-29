# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ClientAppPO.spec.js >> @Web Client App login
- Location: tests\ClientAppPO.spec.js:7:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.cartSection').first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e5]:
    - generic [ref=e7]:
      - link "Automation Automation Practice":
        - /url: ""
        - generic [ref=e8] [cursor=pointer]:
          - heading "Automation" [level=3] [ref=e9]
          - paragraph [ref=e10]: Automation Practice
    - text: 
    - link "Get Shortlisted by Recruiters - Take QA Skill Assessments on TechSmartHire" [ref=e11] [cursor=pointer]:
      - /url: https://techsmarthire.com/
    - list [ref=e12]:
      - listitem [ref=e13] [cursor=pointer]:
        - button " HOME" [ref=e14]:
          - generic [ref=e15]: 
          - text: HOME
      - listitem
      - listitem [ref=e16] [cursor=pointer]:
        - button " ORDERS" [ref=e17]:
          - generic [ref=e18]: 
          - text: ORDERS
      - listitem [ref=e19] [cursor=pointer]:
        - button " Cart" [ref=e20]:
          - generic [ref=e21]: 
          - text: Cart
      - listitem [ref=e22] [cursor=pointer]:
        - button "Sign Out" [ref=e23]:
          - generic [ref=e24]: 
          - text: Sign Out
  - generic [ref=e25]:
    - generic [ref=e26]:
      - heading "My Cart" [level=1] [ref=e27]
      - button "Continue Shopping❯" [ref=e28] [cursor=pointer]
    - heading "No Products in Your Cart !" [level=1] [ref=e30]
```

# Test source

```ts
  1  | class CheckOutPage
  2  | {
  3  |     constructor(page)
  4  |     {
  5  |         this.page = page;
  6  |         this.productsText = page.locator(".cartSection");
  7  |         this.cart = page.locator(".cart");
  8  |         // Safe text matcher that works across all engines without spacing issues
  9  |         this.checkout = page.locator("button:has-text('Checkout')");
  10 |     }
  11 | 
  12 |     async verifyProductCheckout(productName)
  13 |     {
  14 |         // ⏳ FORCE PLAYWRIGHT TO WAIT: Wait until at least one cart item appears on screen
> 15 |         await this.productsText.first().waitFor({ state: 'visible', timeout: 10000 });
     |                                         ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  16 | 
  17 |         const count = await this.productsText.count();
  18 |         console.log(`Total items found in cart: ${count}`); 
  19 | 
  20 |         for (let i = 0; i < count; ++i) 
  21 |         {
  22 |               const currentItemText = await this.productsText.nth(i).locator("h3").textContent();
  23 |               
  24 |               if (currentItemText.trim() === productName) 
  25 |               {
  26 |                    // Click the checkout button
  27 |                    await this.checkout.click();
  28 |                    return; // Exit the function successfully
  29 |               }
  30 |         }
  31 |         
  32 |         throw new Error(`Product "${productName}" was not found in the cart list.`);
  33 |     }   
  34 | }
  35 | 
  36 | module.exports = { CheckOutPage };
```