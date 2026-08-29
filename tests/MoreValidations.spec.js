const {test,expect} = require('@playwright/test')
//to run tests in parallel
// test.describe.configure({mode: 'parallel'});
//skips rest of the tests when one is failed 
test.describe.configure({mode: 'serial'});

test("@Web Popup validations",async({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    // await page.goto("https://google.com");
    // //1. to go back to rahul shetty from google
    // await page.goBack();
    // //2. to move forward to google
    // await page.goForward();

    //VISIBILITY
    await expect(page.locator("#displayed-text")).toBeVisible();
    //to make the locator invisible/hidden
    await page.locator("#hide-textbox").click();
    //verify if it is invisible
    await expect(page.locator("#displayed-text")).toBeHidden();
    // await page.pause();

    //POPUPS
    page.on('dialog' , dialog => dialog.accept());
    await page.locator("#confirmbtn").click();

    //hover
    await page.locator("#mousehover").hover();

    //FRAMES
    //1. Store frames in a variable
    const framesPage = page.frameLocator("#courses-iframe");
    //access frames and then click anchow link
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    //get the content - total sentence
    const textCheck = await framesPage.locator(".text h2").textContent();
    //only need specific text - parse it and print the particular index content - subscribers count
    console.log(textCheck.split(" ")[1]);    
    
})

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