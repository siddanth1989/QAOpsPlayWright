import { expect, type Locator, type Page } from '@playwright/test';
let message1  : string = "Hello";  //have to specify the variable type - that hello is string here
// message1 = 2;  //error - cannot assign number to string
// yells but still compiles because of the type assertion
message1 = "bye";  //ok
console.log(message1);
let age1 : number = 20;
console.log(age1);
let isActive : boolean = false;
let numbers1 : number[] = [1, 2, 3, 4, 5];
let data : any = "this could be anything";  //any type - can be assigned to any type
data = 42; 
function add1(a: number, b: number) : number  //function with type annotations and return type
{
    return a+b;
}

console.log(add1(2,3));  //will cause a compile-time error because of type mismatch
let user1: {name: string, age: number} = {name: "John", age: 34};  
//object type with properties and their types
user1.location = "Hyderabad";  //error - cannot add new property to object 
console.log(user1.location);  //error - cannot access property that doesn't exist
//executes but with complaints because of type assertion
let user2: {name: string, age: number, location: string} = {name: "John", age: 34, location: "Hyderabad"};  
//object type with properties and their types
user2.location = "Mumbai";  //error - cannot add new property to object 
console.log(user2.location);
class CartPage
{
    page : Page; //every property must have a return type specified
    cartProducts : Locator;
    productsText : Locator;
    cart : Locator;
    orders : Locator;
    checkout : Locator;
  constructor(page: any)
  {
    this.page = page;
    this.cartProducts = page.locator("div li").first();
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
    this.checkout = page.locator("text=Checkout");
  }
}
