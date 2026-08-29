const {test,expect} = require('@playwright/test')
test("Screenshot",async({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    await expect(page.locator("#displayed-text")).toBeVisible();
    //exact screenshot of the locator - element - button
     await page.locator("#displayed-text").screenshot({path:'showtext.png'});
    await page.locator("#hide-textbox").click();    
    //store screenshot of button click - complete screenshot of the whole page
    await page.screenshot({path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test("Visual Comparisons",async({page}) =>
{

    await page.goto("https://www.google.com/");
    //compare old and now screenshot to see if any differences
    //first time fails as there is no file to compare
    expect(await page.screenshot()).toMatchSnapshot('landing.png'); //if it doesnt exist it will create with the name given
    //shows the difference image as well along with expected and actual images 

});