// playwright/auth.setup.spec.js
// This script logs in via SSO and saves the authentication state to auth.json

// CRITICAL FIX: Changed to ES Module syntax (import/export) to match playwright.config.js
import { chromium, expect } from '@playwright/test'; 

// Get variables from the globally loaded process.env (loaded by playwright.config.js)
const LOGIN_URL = process.env.LOGIN_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DASHBOARD_URL = process.env.DASHBOARD_URL;

// This is the function Playwright's globalSetup will call.
async function globalSetup(config) {
    console.log('\n--- Running Global Authentication Setup ---');
    
    // Check if variables were successfully loaded by playwright.config.js
    if (!LOGIN_URL || !USERNAME || !PASSWORD || !DASHBOARD_URL) {
        // This should not happen if the .env file is correct and loaded by config.
        throw new Error("FATAL ERROR: Environment variables are not available in global process.env. Please verify the contents of your .env file.");
    }

    // Determine where to save the state from the config
    const storageStatePath = config.use.storageState;

    // Launch a temporary browser context for the setup
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 1. Navigate to the HRMS login page
    await page.goto(LOGIN_URL);
    console.log(`Mapped to HRMS login page: ${LOGIN_URL}`);

    // 2. Click the 'LOGIN WITH SSO' link
    const loginSSOButton = page.getByRole('link', { name: 'Login with SSO' });
    
    await expect(loginSSOButton).toBeVisible(); 
    await loginSSOButton.click();
    console.log('Clicked "Login with SSO".');

    // 3. Wait for the redirect to the Microsoft login page
    await page.waitForURL(/login.microsoftonline.com/i, { timeout: 30000 });
    console.log('Redirected to Microsoft SSO page.');

    // 4. Enter Email/Username (using robust Microsoft selectors)
    const usernameInput = page.locator('input[type="email"], input[name="loginfmt"]');
    await expect(usernameInput).toBeVisible({ timeout: 15000 });
    await usernameInput.fill(USERNAME);
    console.log('Username entered. Submitting...');
    
    // Click Next/Submit button
    const nextButton = page.locator('input[type="submit"][value="Next"], button[type="submit"], #idSIButton9');
    await nextButton.click();

    // 5. Enter Password
    const passwordInput = page.locator('input[name="passwd"], input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await passwordInput.fill(PASSWORD);
    console.log('Password entered.');
    
    // Click Sign In button
    const signInButton = page.locator('input[type="submit"][value="Sign in"], #idSIButton9');
    await signInButton.click();

    // 6. Handle "Stay signed in?" prompt (optional)
    const staySignedInButton = page.locator('input[type="submit"][value="Yes"], button[id="idSIButton9"]');
    if (await staySignedInButton.isVisible({ timeout: 5000 })) {
        await staySignedInButton.click();
        console.log('Clicked "Yes" on "Stay signed in" prompt.');
    }

    // 7. Wait for the final Dashboard URL to load (The HRMS base URL)
    await page.waitForURL(DASHBOARD_URL, { timeout: 60000 });
    console.log('Successfully reached the Dashboard.');

    // 8. Handle the "Punch In" page pop-up (seen in the video)
    const skipButton = page.getByRole('link', { name: 'SKIP' });
    if (await skipButton.isVisible({ timeout: 10000 })) {
         await skipButton.click();
         console.log('Bypassed "Punch In" page by clicking "SKIP".');
    }
    
    // Final check for the URL after all redirects/clicks
    await page.waitForURL(DASHBOARD_URL, { timeout: 10000 });
    console.log('Final Dashboard view confirmed. Saving state...');

    // 9. Save the authentication state
    await page.context().storageState({ path: storageStatePath });
    console.log(`Authentication state saved to ${storageStatePath}`);

    // Close the temporary browser
    await browser.close();
}

// Export the function as the global setup entry point
export default globalSetup;