const {test,expect}=   require ('@playwright/test');

test('UI Controls', async ({ page }) => 
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/"); 
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");        
    //blink attribute
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");
    
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    
    //boolean check
    console.log(await page.locator(".radiotextsty").last().isChecked()); //only useful if check logs not in real time scenario

    //assertion to check if right radiobutton is selected
    await expect(page.locator(".radiotextsty").last()).toBeChecked(); //success if checked

    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked(); //success if checked

    //uncheck
    await page.locator("#terms").uncheck();

    //check boolen if unchecked - no option to give assertion in playwright for uncheck
    console.log(await page.locator("#terms").isChecked());

    //converting boolen to assertion - truthy or falsy
    expect(await page.locator("#terms").isChecked()).toBeFalsy();

    //check if it has blinking attribute

    await expect(documentLink).toHaveAttribute('class','blinkingText');

    //to see the result before your test closes after execution
    await page.pause();

});
