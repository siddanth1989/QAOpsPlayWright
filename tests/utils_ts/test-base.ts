import {test as baseTest} from '@playwright/test';
interface TestDataForOrder{
    username: string;
    password: string;
    productName: string;
};

export const customTest = baseTest.extend<{testDataForOrder: TestDataForOrder}>(         //export new behavior by extending with new properties
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