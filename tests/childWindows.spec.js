const {test,expect}=   require ('@playwright/test');

test('Child Windows Handling', async ({ browser }) =>  //starting with a browser and not page since our tests include multiple pages not single
{
    const context = await browser.newContext();
    const page = await context.newPage(); //this page doesn't have knowledge outside this originally created page
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/"); 
    //blinktext link
    const documentLink = page.locator("[href*='documents-request']"); //wait for an event of new page - page locator is not going to work
    
    const [newPage] =await Promise.all([ //array of steps to be executed in parallel , return type is newPage
    //written before clicking as it should listen the upcoming event - which is new page opening here
    context.waitForEvent('page'), //listens for a new page to be opened
    //pending,promise,fulfilled
    //no await needed since both these steps need to be tied
    documentLink.click(),    
    ]) //new page is opened
   
    const text = await newPage.locator(".red").textContent(); //print a para in new tab
    console.log(text);
    //now we want to grab domain from the text and put in the email field of parent window/tab/page
    //use split functionality
    const arrayText = text.split("@")
    //store in a variable
    const domain = arrayText[1].split(" ")[0]
    console.log(domain);

    //bring focus to original page
    await page.bringToFront();
    
    //enter this domain as username in original page
    await page.locator('#username').fill(domain);
    
    //print in output
    // const output = await page.locator("#username").textContent();
    // console.log(output);
    console.log(await page.locator("#username").inputValue()); //textContent is not working hence used inputValue
    //textContent() - gets value before DOM 

    //to see the result before your test closes after execution
    await page.pause();

});
