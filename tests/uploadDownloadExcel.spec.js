const ExcelJS = require('exceljs');
const { test, expect } = require('@playwright/test');

//Async Await - 
// Method 2
async function writeExcelTest(searchText,replaceText,change,filePath)
{
   
const workbook = new ExcelJS.Workbook();
//Read File
//async hence await
await workbook.xlsx.readFile(filePath)
//entire sheet
const worksheet = workbook.getWorksheet('Sheet1');
//asynchrous - before giving output it continues otherwise
const output = await readExcel(worksheet,searchText);
//to get each row
const cell = worksheet.getCell(output.row,output.column+change.colChange);
cell.value = replaceText;  //modifying existing value with new value

//Write File
//Ensure Excel is closed otherwise you see error - resource busy or locked
await workbook.xlsx.writeFile(filePath)

}

//send worksheet as banana

async function readExcel(worksheet,searchText)
{
     let output = {row:-1,column:-1}; //to access row col numbers globally
worksheet.eachRow(  (row,rowNumber) =>
{
    //to get each cell
    row.eachCell( (cell,colNumber)  =>
    {
        //Find coordinates for particular cell value
        if(cell.value === searchText)
        {
            output.row = rowNumber;
            output.column = colNumber;
            console.log(rowNumber, colNumber);
        }
        
    })
})
return output;
}
//send text.replacetext and file path as argument instead of using it every time
//update mango price to 350
const filePath = 'D:/Siddanth/PlayWrightAutomation/Code/Read and Write Excel/excelTestNew.xlsx';
//Use Playwright instead of function
test('Upload download excel validation', async ({page})=>
{
    const textSearch = 'Mango';
    const updateValue = '350';
    const filePath = 'C:/Users/siddanth.patlannagar/Downloads/download.xlsx';
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");
    //tell playwright to wait till file is downloaded
    const downloadPromise= page.waitForEvent('download');
    await page.getByRole('button',{name:'Download'}).click(); //filter by role and name
    await downloadPromise;
    //modify the downloaded excel
    writeExcelTest(textSearch,updateValue, {rowChange:0, colChange:2}, filePath);
    //upload modified excel
    await page.locator("#fileinput").click();
    //Browse is outside playwright hence use upload related function - only applicable for type=file
    await page.locator("#fileinput").setInputFiles(filePath);
    //Verify the changes made
    const textLocator = page.getByText(textSearch)
    //scan in specific row where our text locator is - desired row
    const desiredRow = await page.getByRole('row').filter({has: textLocator});
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);

});