const {LoginPage} = require('../pageobjects/LoginPage');
const {DashboardPage} = require('../pageobjects/DashboardPage');
const {CheckOutPage} = require('../pageobjects/CheckOutPage');
const {OrdersReviewPage} = require('./OrdersReviewPage');
const {OrdersHistoryPage} = require('./OrdersHistoryPage');
const {CartPage} = require('./CartPage');
class POManager
{
    constructor(page)
    {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.checkOutPage = new CheckOutPage(this.page);        
        this.ordersReviewPage = new OrdersReviewPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
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

module.exports={POManager};