const ExcelJS = require('exceljs');

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

// Run the first update, then run the second update right after it finishes
writeExcelTest('Kivi', 'New Zealand', {rowChange:0, colChange:0}, filePath)
    .then(() => {
        return writeExcelTest('Mango', 550, {rowChange:0, colChange:2}, filePath);
    })
    .then(() => {
        console.log("Both updates completed successfully, one after the other!");
    });