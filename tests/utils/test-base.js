const base = require('@playwright/test');

exports.customtest = base.test.extend(         //export new behavior by extending with new properties
    // this test is visible to all test cases
    {
        //Custom Fixture
        testDataForOrder: 
        {
            username : "anshika@gmail.com",
            password : "Iamking@000",
            productName : "ZARA COAT 3"
        }

    }
)