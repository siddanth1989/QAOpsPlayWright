export class CheckOutPage
{
    constructor(page)
    {
        this.page = page;
        this.productsText = page.locator(".cartSection");
        this.cart = page.locator(".cart");
        // Safe text matcher that works across all engines without spacing issues
        this.checkout = page.locator("button:has-text('Checkout')");
    }

    async verifyProductCheckout(productName)
    {
        // ⏳ FORCE PLAYWRIGHT TO WAIT: Wait until at least one cart item appears on screen
        await this.productsText.first().waitFor({ state: 'visible', timeout: 10000 });

        const count = await this.productsText.count();
        console.log(`Total items found in cart: ${count}`); 

        for (let i = 0; i < count; ++i) 
        {
              const currentItemText = await this.productsText.nth(i).locator("h3").textContent();
              
              if (currentItemText.trim() === productName) 
              {
                   // Click the checkout button
                   await this.checkout.click();
                   return; // Exit the function successfully
              }
        }
        
        throw new Error(`Product "${productName}" was not found in the cart list.`);
    }   
}

module.exports = { CheckOutPage };