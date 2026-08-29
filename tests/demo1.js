"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message1 = "Hello"; //have to specify the variable type - that hello is string here
// message1 = 2;  //error - cannot assign number to string
// yells but still compiles because of the type assertion
message1 = "bye"; //ok
console.log(message1);
var age1 = 20;
console.log(age1);
var isActive = false;
var numbers1 = [1, 2, 3, 4, 5];
var data = "this could be anything"; //any type - can be assigned to any type
data = 42;
function add1(a, b) {
    return a + b;
}
add1(2, 3); //will cause a compile-time error because of type mismatch
var user1 = { name: "John", age: 34 };
//object type with properties and their types
user1.location = "Hyderabad"; //error - cannot add new property to object 
console.log(user1.location); //error - cannot access property that doesn't exist
//executes but with complaints because of type assertion
var user2 = { name: "John", age: 34, location: "Hyderabad" };
//object type with properties and their types
user2.location = "Mumbai"; //error - cannot add new property to object 
console.log(user2.location);
var CartPage = /** @class */ (function () {
    function CartPage(page) {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
        this.checkout = page.locator("text=Checkout");
    }
    return CartPage;
}());
