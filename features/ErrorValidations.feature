Feature: Ecommerce validations
@Validation
    Scenario: Placing the Order
        Given a login to Ecommerce2 application with "anshika@gmail.com" and "Iamking@000"
        Then Verify Error message is displayed

#Parameterization, Parallel, Html, Rerun Failed Tests 
