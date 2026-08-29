const ExcelJS = require('exceljs');

//Async Await - 
// Method 2
async function excelTest()
{
    let output = {row:-1,column:-1}; //to access row col numbers globally
const workbook = new ExcelJS.Workbook();
//Read File
//async hence await
await workbook.xlsx.readFile('D:/Siddanth/PlayWrightAutomation/Code/Read and Write Excel/exceldownloadTest.xlsx')
//entire sheet
const worksheet = workbook.getWorksheet('Sheet1');
//to get each row
worksheet.eachRow(  (row,rowNumber) =>
{
    //to get each cell
    row.eachCell( (cell,colNumber)  =>
    {
        //Find coordinates for particular cell value
        if(cell.value === 'Banana')
        {
            output.row = rowNumber;
            output.column = colNumber;
            console.log(rowNumber, colNumber);
        }
        
    })
})
const cell = worksheet.getCell(output.row,output.column);
cell.value = 'Republic';  //modifying existing value with new value

//Write File
//Ensure Excel is closed otherwise you see error - resource busy or locked
await workbook.xlsx.writeFile('D:/Siddanth/PlayWrightAutomation/Code/Read and Write Excel/exceldownloadTest.xlsx')

}
excelTest();