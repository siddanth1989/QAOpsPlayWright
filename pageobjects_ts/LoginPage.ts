import {test, expect, Locator, Page} from '@playwright/test';
export class LoginPage 
{
    signInbutton: Locator;
    userName: Locator;
    password: Locator;  
    page: Page;
    constructor(page: Page)
    {
        this.page = page;
        this.signInbutton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo()
    {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin(username: string, password: string)
    {
        await this.userName.type(username);
        await this.password.type(password);
        await this.signInbutton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
export default LoginPage;