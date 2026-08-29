class PlaceOrderPage
{
    constructor(page)
    {
        this.dropdowns = page.locator(".ta-results");
        this.placeorder = page.locator("text= Place Order");
        this.page = page;
    }

    async verifyDetails(dropdowns)
    {
          const countryInput = this.page.getByPlaceholder('Select Country');
        await countryInput.waitFor({ state: 'visible', timeout: 10000 });
    
        // Type the sequence into the verified element instance
        await countryInput.pressSequentially("ind", { delay: 150 });
           const dropdown = this.dropdowns;
           await dropdown.waitFor();
           const optionsCount = await dropdown.locator("button").count();
           for (let i = 0; i < optionsCount; ++i) {
              const text = await dropdown.locator("button").nth(i).textContent();
              if (text === " India") {
                 await dropdown.locator("button").nth(i).click();
                 break;
              }
            }
         
    }   

    async placeOrder()
    {
        await this.placeorder.click();
    }
}

module.exports={PlaceOrderPage};