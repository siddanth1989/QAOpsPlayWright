// This script bypasses Playwright's config runner to test authentication directly.
// NOTE: Using CommonJS (require) for direct execution to avoid "import statement outside a module" error.

const { chromium } = require('@playwright/test');
require('dotenv/config'); // Load environment variables from .env
const path = require('path');
// Removed fileURLToPath and import.meta.url as they are ES module specific

// --- Configuration Constants from .env ---
const LOGIN_URL = process.env.LOGIN_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const DASHBOARD_URL = process.env.DASHBOARD_URL;
const AUTH_FILE = process.env.AUTH_FILE || path.resolve(__dirname, 'playwright', '.auth', 'auth.json');

// NOTE: Since we are using CommonJS, __dirname is automatically the directory of the current script (D:\Siddanth\PlayWrightAutomation\tests)
// We need to adjust the path resolution for the final AUTH_FILE slightly.
// The file should be saved relative to the main project root, so we adjust the path logic.
// const authFileUsed = AUTH_FILE; // Relying on AUTH_FILE from .env, or the default relative path.
const authFileUsed = path.resolve(process.cwd(), 'tests', 'playwright', '.auth', 'auth.json');

// Function to perform the SSO login steps
async function authenticate() {
    console.log('--- Starting Standalone Authentication (CommonJS Mode) ---');
    
    // Launch browser (using Chromium and showing GUI)
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // 1. Navigate to the HRMS login page
        await page.goto(LOGIN_URL);
        console.log(`Mapsd to HRMS login page: ${LOGIN_URL}`);

        // 2. Click the 'LOGIN WITH SSO' button
        console.log('Clicking "LOGIN WITH SSO"...');
        await page.getByRole('button', { name: 'LOGIN WITH SSO' }).click();

        // 3. Wait for the redirect to the Microsoft login page
        await page.waitForURL(/login.microsoftonline.com/i, { timeout: 30000 });
        console.log('Redirected to Microsoft SSO page.');

        // 4. Enter Email/Username
        const usernameInput = page.locator('input[type="email"], input[name="loginfmt"]');
        await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
        await usernameInput.fill(USERNAME);
        console.log('Username entered. Submitting...');
        
        const nextButton = page.locator('input[type="submit"][value="Next"], button[type="submit"], #idSIButton9');
        await nextButton.click();

        // 5. Enter Password
        const passwordInput = page.locator('input[name="passwd"], input[type="password"]');
        await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await passwordInput.fill(PASSWORD);
        console.log('Password entered.');
        
        const signInButton = page.locator('input[type="submit"][value="Sign in"], #idSIButton9');
        await signInButton.click();

        // 6. Handle "Stay signed in?" prompt (if it appears)
        const staySignedInButton = page.locator('input[type="submit"][value="Yes"], button[id="idSIButton9"]');
        if (await staySignedInButton.isVisible({ timeout: 5000 })) {
            console.log('Clicking "Yes" on "Stay signed in" prompt.');
            await staySignedInButton.click();
        }

        // 7. Wait for the final Dashboard URL to load
        await page.waitForURL(DASHBOARD_URL, { timeout: 60000 });
        console.log('Successfully reached the Dashboard.');

        // 8. Handle the "Punch In" page pop-up
        const skipButton = page.getByRole('link', { name: 'SKIP' });
        if (await skipButton.isVisible({ timeout: 10000 })) {
             console.log('Bypassing "Punch In" page by clicking "SKIP".');
             await skipButton.click();
        }
        
        // Final check to ensure we are on the dashboard
        await page.waitForURL(DASHBOARD_URL, { timeout: 10000 });
        console.log('Final Dashboard view confirmed.');


        // 9. Save the authentication state
        await page.context().storageState({ path: authFileUsed });
        console.log(`✅ Authentication state successfully saved to ${authFileUsed}`);
        
    } catch (error) {
        console.error('❌ Authentication Failed:', error.message);
        throw error;
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
}

// Execute the function
authenticate().catch(error => {
    console.error('Script failed to run:', error.message);
    process.exit(1);
});