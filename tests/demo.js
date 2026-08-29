let message = "Hello"; //dynamically understands the variable type - hello is string here
message = 2;
console.log(message);
let age = 20;
console.log(age);
let numbers = [1, 2, 3, 4, 5];
function add(a, b)//function with type annotations and return type
{
    return a+b;
}

console.log(add(2,"3"));  //will return 23 because of type coercion in JS
let user = {name: "John", age: 34};  
user.location = "Hyderabad"; //adding new property to the object
