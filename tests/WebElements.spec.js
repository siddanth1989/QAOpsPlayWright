const {test,expect}=   require ('@playwright/test');

test('Browser Context Playwright test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");
    // await page.waitForTimeout(2000);
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    // await page.waitForTimeout(2000);
    await userName.fill("rahulshetty");
    // await page.waitForTimeout(2000);
    await page.locator("[type='password']").fill("learning");
    // await page.waitForTimeout(2000);
    await signIn.click();
    // await page.waitForTimeout(2000);
    //Get text of error message and print
    console.log(await page.locator("[style*='block']").textContent());
    //Checks if error message is present
    await expect(page.locator("[style*='block']")).toContainText('Incorrect ');
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    //get first element in dashboard - unique out of 4
    console.log(await page.locator(".card-body a").first().textContent());
    console.log(await cardTitles.first().textContent());
    //get second element in dashboard - unique out of 4
    console.log(await page.locator(".card-body a").nth(1).textContent());
    console.log(await cardTitles.nth(1).textContent());
    //titles of all elements
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
    //returns null array when textcontent(commented) is not used as it doesn't wait for first element
});