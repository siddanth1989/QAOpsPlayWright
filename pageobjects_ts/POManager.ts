//const {LoginPage} = require('.LoginPage'); //this is the old js way of importing the class from another file. The new way is to use the import statement.
import  {LoginPage} from './LoginPage'; //this is the new ts way of importing the class from another file. The old way is to use the require statement.
import {DashboardPage} from './DashboardPage';
import {CheckOutPage} from './CheckOutPage';
import {OrdersReviewPage} from './OrdersReviewPage';
import {OrdersHistoryPage} from './OrdersHistoryPage';
import {CartPage} from './CartPage';    
import {Page} from '@playwright/test';

export class POManager
{
    loginPage: LoginPage; //class object is the type name
    dashboardPage: DashboardPage;
    checkOutPage: CheckOutPage;
    ordersReviewPage: OrdersReviewPage;
    ordersHistoryPage: OrdersHistoryPage;
    cartPage: CartPage;
    page: Page;

    constructor(page: Page)
    {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.checkOutPage = new CheckOutPage(this.page);        
        this.ordersReviewPage = new OrdersReviewPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
        this.cartPage = new CartPage(this.page);
    }

    getLoginPage()
    {
            return this.loginPage;
    }
     
    getDashboardPage()
    {
            return this.dashboardPage;
    }

    getCheckOutPage()
    {
            return this.checkOutPage;
    }
    
    getOrdersReviewPage()
    {
            return this.ordersReviewPage;
    }

    getOrdersHistoryPage()
    {
            return this.ordersHistoryPage;
    }

   
    
}

export default POManager;