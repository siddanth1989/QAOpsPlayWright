class APIUtils
{
    constructor(apiContext,loginPayLoad)
    {
        this.apiContext = apiContext; //has access to entire class = this
        this.loginPayLoad = loginPayLoad; //login is important API call and this is common. Send this in constructor itself
    }
    async getToken() //mark method as async since await is used inside
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",  //end point
             {
                data:this.loginPayLoad                
             }); //200.201
             
                  
             const loginResponseJson = await loginResponse.json();             
             const token = loginResponseJson.token;             
             console.log(token); 
             return token;
    }

    async createOrder(orderPayLoad)
    {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",  //end point
     {
        data:orderPayLoad,
        headers: 
        {
            'Authorization': response.token, //token from login
            'Content-Type': 'application/json'
        },
     })
     const orderResponseJson = await orderResponse.json();
     console.log(orderResponseJson);
     const orderId = orderResponseJson.orders[0];
     response.orderId = orderId;  //new property for orderId
     return response; //holds property of orderid and token
    }
}

module.exports = { APIUtils };