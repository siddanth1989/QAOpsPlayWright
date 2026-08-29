// This test automates the SSO login process and checks dashboard navigation.
// It is designed to run in headed mode for easier debugging of the SSO flow.

import { test, expect } from '@playwright/test';

// --- Test Data Retrieved from .env ---
const LOGIN_URL = process.env.LOGIN_URL;
const DASHBOARD_URL = process.env.DASHBOARD_URL; 
const PASSWORD = process.env.PASSWORD ? process.env.PASSWORD.trim() : null; 

// --- CRITICAL FIX: HARDCODE USERNAME LOCALLY ---
// Defining the full string here bypasses the encoding issue in the .env file.
const CORRECT_USERNAME = "siddanth.patlannagari@ispace.com"; 

// Safety check
if (!DASHBOARD_URL || !CORRECT_USERNAME || !PASSWORD || !LOGIN_URL) {
    throw new Error("ERROR: Missing one or more required environment variables (DASHBOARD_URL, LOGIN_URL, and PASSWORD) in the .env file. Username is hardcoded.");
}

const BIRTHDAY_RECIPIENT_NAME = "Mohammed Zishan Ahmed"; 

test('HRMS Dashboard Navigation and Birthday Profile Check (Full SSO Flow)', async ({ page }) =>
{
    // --- 1. Navigate to the HRMS Login Page ---
    await page.goto(LOGIN_URL); 
    
    // --- 2. Initiate SSO Login ---
    console.log('Performing SSO login...');

    // 2.1 Click the "Login with SSO" link
    await page.getByRole('link', { name: 'Login with SSO' }).click();

    // 2.2 Wait for the page to redirect to the external SSO provider (Microsoft)
    await page.waitForURL(/login.microsoftonline.com/i, { timeout: 15000 });
    console.log('Redirected to external SSO provider (Microsoft).');

    // --- 3. Handle Microsoft Login Page 1 (Username/Email Input) ---
    const emailInput = page.locator('input[type="email"]');
    
    // Wait for the input field to be visible and ready
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });

    console.log(`Email being used (Hardcoded Override): "${CORRECT_USERNAME}"`); // Log the final, hardcoded value

    // Use type() instead of fill() to simulate key presses
    await emailInput.type(CORRECT_USERNAME, { delay: 50 }); 
    
    // Click the "Next" button/submit the form
    await page.getByRole('button', { name: 'Next' }).click();

    // --- 4. Handle Microsoft Login Page 2 (Password Input) ---
    // Wait for the password field to be visible
    await page.waitForSelector('input[type="password"]', { state: 'visible', timeout: 10000 });

    // Selector: Input field of type password
    await page.locator('input[type="password"]').fill(PASSWORD);
    
    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // --- 5. Handle Manual MFA/Security Check (Timeout Added Here) ---
    // Wait for the final redirect back to the HRMS domain (Punch-in or Dashboard)
    // We expect the browser to land on the HRMS domain within 30 seconds after sign-in.
    await page.waitForURL(DASHBOARD_URL + '/**' , { timeout: 30000 }); // Increased timeout for MFA 
    console.log('Successfully returned to HRMS domain. Waiting for 20 seconds for manual MFA action.');
    
    // *** WAIT INCREASED TO 20 SECONDS (20000ms) ***
    await page.waitForTimeout(20000); 
    
    // --- 6. Handle Punch-in / Location Prompt (Necessary if it appears before dashboard) ---
    const skipButton = page.locator('.skipbutton'); 
    
    // Check if the skip button is visible within a short timeout
    if (await skipButton.isVisible({ timeout: 5000 })) {
        console.log('Punch-in prompt detected. Bypassing by clicking "Skip" to reach the Dashboard.');
        // CRITICAL FIX: Clicking skip will now perform the final navigation.
        await skipButton.click(); 
        
        // Wait for the final Dashboard URL after clicking Skip
        await page.waitForURL(DASHBOARD_URL, { timeout: 10000 }); 
        console.log('Successfully navigated past Punch-in to the Dashboard.');
    } else {
        // If Skip button is not visible, we assume we are already on the dashboard.
        console.log('Punch-in prompt not visible. Assuming direct landing on Dashboard.');
    }
    
    // --- 7. Dashboard Navigation Verification ---
    await page.waitForURL(DASHBOARD_URL, { timeout: 10000 }); // Ensure we are on the dashboard
    await expect(page.locator('h1')).toHaveText('Dashboard');
    
    // --- 8. Click Birthday Recipient ---
    const birthdaySection = page.locator('text=Upcoming Birthdays');
    const recipientLink = birthdaySection.locator(`a:has-text("${BIRTHDAY_RECIPIENT_NAME}")`);

    await expect(recipientLink).toBeVisible();
    await recipientLink.click();
    
    // --- 9. Profile Verification ---
    await expect(page.locator('h1')).toHaveText(BIRTHDAY_RECIPIENT_NAME, { timeout: 10000 });
    
    console.log(`Successfully navigated to ${BIRTHDAY_RECIPIENT_NAME}'s profile.`);
});