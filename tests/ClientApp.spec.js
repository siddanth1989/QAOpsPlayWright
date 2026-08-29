const { test, expect } = require('@playwright/test');

test.skip('Browser Context Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const cardTitles = page.locator(".card-body h5");

    await page.goto("https://rahulshettyacademy.com/client/auth/login");
    
    // Go to Register Page
    const register = page.locator('.text-reset');
    await register.click();
    
    // Using waitForLoadState is better than hardcoded timeouts, but keeping your timeouts for consistency
    await page.waitForTimeout(1000); 

    // Fill Registration Form
    const fname = page.locator('#firstName');
    await fname.fill("Siddanth");

    const lname = page.locator('#lastName');
    await lname.fill("Reddy");

    const email = page.locator('#userEmail');
    await email.fill("siddanth1111@gmail.com");

    const phone = page.locator('#userMobile');
    await phone.fill("1234567890");

    await page.selectOption('select[formcontrolname="occupation"]', { label: 'Engineer' });
    
    await page.check('input[type="radio"][value="Male"]');

    const pwd = page.locator('#userPassword');
    await pwd.fill("#Rohit45");

    const cpwd = page.locator('#confirmPassword');
    await cpwd.fill("#Rohit45");

    await page.check('input[formcontrolname="required"]');
    await page.waitForTimeout(1000);

    // --- FIX STARTS HERE ---
    const reg = page.locator('#login'); // This targets the 'Register' button on this page
    
    // Ensure visibility
    await reg.waitFor({ state: 'visible' });
    
    // Add the missing AWAIT here
    await reg.click(); 
    
    // Wait for the navigation or success message after clicking Register
    await page.waitForTimeout(2000);

    // --- LOGIN FLOW after registration ---

    
    const logbtn = page.locator('.btn.btn-primary'); 
    await logbtn.waitFor({ state: 'visible' });
    
    // Add the missing AWAIT here
    await logbtn.click(); 
    
    // Fill credentials FIRST, then click Login
    await email.fill("siddanth3234@gmail.com");
    await pwd.fill("#Rohit45");
    
    const login = page.locator('#login');
    await login.click();
    await page.waitForTimeout(2000);

    // Get first element in dashboard
    console.log(await cardTitles.first().textContent());
});