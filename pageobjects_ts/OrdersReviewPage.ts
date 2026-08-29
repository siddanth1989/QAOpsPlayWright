import {test, expect, Locator, Page} from '@playwright/test';
export class OrdersReviewPage 
{
    country: Locator;
    dropdown: Locator;
    emailId: Locator;
    submit: Locator;
    orderConfirmationText: Locator;
    orderId: Locator;
    page: Page; 
    constructor(page: Page) {
        this.page = page;
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.emailId = page.locator(".user__name [type='text']").first();
        this.submit = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
    }

    async searchCountryAndSelect(countryCode: string, countryName: string) {
        // ⏳ Wait for input to exist and click it to focus
        await this.country.waitFor({ state: 'attached', timeout: 10000 });
        await this.country.click();
        
        // Using pressSequentially as .type is deprecated in newer Playwright versions
        await this.country.pressSequentially(countryCode, { delay: 100 });
        
        // Wait for dropdown to become fully visible
        await this.dropdown.waitFor({ state: 'visible', timeout: 10000 });
        
        const optionsCount = await this.dropdown.locator("button").count();
        for (let i = 0; i < optionsCount; ++i) {
            let text : any;
            text = await this.dropdown.locator("button").nth(i).textContent();
            if (text.trim() === countryName) {
                await this.dropdown.locator("button").nth(i).click();
                break;
            }
        }
    }

    async VerifyEmailId(username: string) {
        // Use toHaveValue or toContainText for input fields instead of toHaveText
        await expect(this.emailId).toHaveText(username);
    }

    async SubmitAndGetOrderId() {
        // ⏳ Wait for layout shifts and Angular background rendering to settle
        await this.page.waitForLoadState('networkidle');
        
        // ⚡ Force the click to bypass strict stability checks if the element re-renders
        await this.submit.click({ force: true });
        
        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        return await this.orderId.textContent();
    }
}

export default OrdersReviewPage;