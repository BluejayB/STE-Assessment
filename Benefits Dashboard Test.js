// Jay Latos - UI Automation Interview (08-2021)
// Benefits Dashboard Test.js

//I'll be verbose in my comments for the sake of discussion

//Requires node.js
//Requires selenium & chrome browser
const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");
const USERNAME = "TestUser21";
const PASSWORD = "}pv=n!x3[0FU";

//JavaScript only has one one thread, so we use async & await to avoid I/O problems
async function dashboardTest(){
 
    ///////////// SIGN-IN /////////////////////
    //Here I will use a variety of methods for getting elements, just to show how to use them,
    //but in practice I would largely stick with xpath for its flexibility amid complex pages.
    //If tests are slow for some reason, it could potentially be worth using IDs instead of xpaths.

    //Open website, sign in with above-defined user/pass
    let driver = await new Builder().forBrowser("chrome").build();

     await driver.get("https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/LogIn");
    
     await driver.findElement(By.name("Username")).sendKeys(USERNAME,Key.RETURN);
     await driver.findElement(By.name("Password")).sendKeys(PASSWORD,Key.RETURN);

    //Make sure we're in the right place, check the page title
     var title = await driver.getTitle();
    if(title==="Employees - Paylocity Benefits Dashboard"){
        console.log("PASS, Page title is correct:", title)
     } else {
        console.log("FAIL, Page title is incorrect:", title)
     };

    //////////// ADD ////////////////////////
    //Check the Add button
    var btnName = await driver.findElement(By.id("add")).getText();
    if(btnName==="Add Employee"){
        console.log("PASS, Add button name is correct:", btnName)
     } else {
        console.log("FAIL, Add button name is incorrect:", btnName)
     };

    //Check the Add button/modal
    //I use switchTo here, which is "blind" in the same way a user would be. If I get the wrong active 
    //element (we'll check the modal's title) then there is likely an issue with the Add button script.
    //But, switchTo may not be appropriate in a more complex environment, in which case I'd use the expected ID/name/xpath 
     await driver.findElement(By.id("add")).click();
     driver.switchTo().activeElement();
     var title = await driver.findElement(By.xpath('//*[@id="employeeModal"]/div/div/div[1]/h5')).getText();
     if(title==="Add Employee"){
        console.log("PASS, Modal opened:", title)
     } else {
        console.log("FAIL, Modal did not open or has the wrong title:", title)
     };
     
     //Check Add modal's X button
     //There is probably a better way to check the modal is closed _O.o_
     await driver.findElement(By.xpath('//*[@id="employeeModal"]/div/div/div[1]/button')).click();
     var title = await driver.findElement(By.xpath('//*[@id="employeeModal"]/div/div/div[1]/h5')).getText();
     if(title==="Add Employee"){
        console.log("FAIL, The modal did not close")
     } else {
        console.log("PASS, The modal closed")
     };

     //Check Add modal's Cancel button
     //---> the same as we did for x button

     //Check Add modal closes by clicking outside it
     //---> the same as we did for x button

     //Check the modal's Add button
     //We previously closed the modal, so we need to open it again
     await driver.findElement(By.id("add")).click();

     //Our negative case, no data should be added if fields are blank, so the modal should stay up.
     //Rather than depend on the fields being blank, we'll set them here to be sure
     await driver.findElement(By.xpath('//*[@id="firstName"]')).sendKeys("");
     await driver.findElement(By.xpath('//*[@id="lastName"]')).sendKeys("");
     await driver.findElement(By.xpath('//*[@id="dependants"]')).sendKeys("");
     await driver.findElement(By.xpath('//*[@id="addEmployee"]')).click();
     //And make sure the modal stays up
     var title = await driver.findElement(By.xpath('//*[@id="employeeModal"]/div/div/div[1]/h5')).getText();
     if(title==="Add Employee"){
        console.log("PASS, The modal stayed open with no data")
     } else {
        console.log("FAIL, The modal has closed without adding data")
     };

     //Check that data is commited via Add button
     await driver.findElement(By.xpath('//*[@id="firstName"]')).sendKeys("Bluejay");
     await driver.findElement(By.xpath('//*[@id="lastName"]')).sendKeys("Blackburn");
     await driver.findElement(By.xpath('//*[@id="dependants"]')).sendKeys("1");
     await driver.findElement(By.xpath('//*[@id="addEmployee"]')).click();
     
     //Problem area
     //Seems to be a timing issue for checking the table, which is causing the tests to fail even though it works
     //
     // Check the modal closed as expected
     var title = await driver.findElement(By.xpath('//*[@id="employeeModal"]/div/div/div[1]/h5')).getText();
     if(title==="Add Employee"){
        console.log("FAIL, The modal stayed open after adding data")
     } else {
        console.log("PASS, The modal closed after adding data")
     };

     //Check for newly added data in the grid
     var newdata = driver.findElement(By.xpath('//div[1]/table/tbody/tr/td[contains(.,"Bluejay")]'));
     if (newdata.getText() === "Bluejay") {
         console.log("PASS, The data was added to the grid")
     } else {
         console.log("FAIL, The data was not added to the grid")
     };

    // Other tests to do here would include:
    //  - check calculated values
    //  - min max field lengths/values & validation messages
    //  - special characters & validation messages
    //  - duplicate data and/or adding repeat data after deleting it


     //////////// EDIT ////////////////////////
     //The same as we did for Add
    

     //////////// DELETE //////////////////////
     //Check row is removed from grid
    
     //await driver.quit();
};

dashboardTest();