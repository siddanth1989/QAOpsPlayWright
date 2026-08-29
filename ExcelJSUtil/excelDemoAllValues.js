const ExcelJS = require('exceljs');
//creating object of the exceljs class
//collection of sheets
//Function Wrap -
// Method 1

// const workbook = new ExcelJS.Workbook();
// workbook.xlsx.readFile('D:/Siddanth/PlayWrightAutomation/Code/Read and Write Excel/exceldownloadTest.xlsx').then(function(){
// //entire sheet
// const worksheet = workbook.getWorksheet('Sheet1');
// //to get each row
// worksheet.eachRow(  (row,rowNumber) =>
// {
//     //to get each cell
//     row.eachCell( (cell,colNumber)  =>
//     {
//         console.log(cell.value);
//     })
// })
// })

//Async Await - 
// Method 2
async function excelTest()
{
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile('D:/Siddanth/PlayWrightAutomation/Code/Read and Write Excel/exceldownloadTest.xlsx')
//entire sheet
const worksheet = workbook.getWorksheet('Sheet1');
//to get each row
worksheet.eachRow(  (row,rowNumber) =>
{
    //to get each cell
    row.eachCell( (cell,colNumber)  =>
    {
        console.log(cell.value);
    })
})
}
excelTest();