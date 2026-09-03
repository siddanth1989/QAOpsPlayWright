const {test,expect}=   require ('@playwright/test');

//Calendar Spec File in sidhu_fixes branch

test('Calendar validations', async ({ page }) => 
    
    {
        //declare variables for month,date,year
        const monthNumber= "6";
        const date = "15";
        const year = "2027";
        const expectedList = [monthNumber,date,year];
        await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
        //click calendar field
        await page.locator(".react-date-picker__inputGroup").click();
        //click section to get list of years
        await page.locator(".react-calendar__navigation__label").click();
        //click particular year
        await page.locator(".react-calendar__navigation__label").click(); //same locator since its at the same location
        //avoid hardcoding - use year variable
        await page.getByText(year).click();
        //map 6 to june - array starts with 0 for all the months - ex : 6-1 = 5 for June
        //convert string to number 
        await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
        //select date by tagname - abbr
        //pass variable instead of hardcode
        await page.locator("//abbr[text()='"+date+"']").click();
        // await page.pause();
        //give assertion to verify if its correct date
        //input elements inside 
        const inputs = await page.locator(".react-date-picker__inputGroup__input");
        const collectedDate = []; // 1. Create an empty list to store values
        //use for loop to navigate to each and every element of locator to extract month,date,year
        for(let i=0;i<expectedList.length;i++)
        {
            
            const value = await inputs.nth(i).inputValue(); //await is needed for action
            //compare the actual value at index to expected value
            expect(value).toEqual(expectedList[i]);    
            // 2. Add this value to our list
            collectedDate.push(value);
        }
            // 3. Print the full date by joining the list with slashes
            // Output: 06/15/2027
            console.log(collectedDate.join("/"));
    });