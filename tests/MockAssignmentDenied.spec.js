const { test, expect, request } = require('@playwright/test');

// =========================================================================
// 1. GLOBAL HELPER FUNCTION
// =========================================================================
async function loginAs(page) {
    await page.goto('https://eventhub.rahulshettyacademy.com/');
    await page.locator('#email').fill('siddanth1989@gmail.com');
    await page.locator('#password').fill('#Rohit45');
    await page.locator("#login-btn").click();
    
    // Wait for the login actions and initial auth redirection network calls to settle
    await page.waitForLoadState('networkidle');    
}

const loginPayLoad = { 
    email: "sidhu@yahoo.com", 
    password: "#Rohit45" 
};

// Global variables for cross-step data sharing
let token;
let eventId;
let yahooBookingId;

test.beforeAll(async () => {
    const apiContext = await request.newContext();

    // ==========================================
    // STEP 1 — Login as Yahoo user via API
    // ==========================================
    const loginResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login", {
        data: loginPayLoad,
        timeout: 60000
    });

    if (!loginResponse.ok()) {
        console.error("❌ API Login Failed!");
        console.error("Status Code:", loginResponse.status());
        console.error("Response Text:", await loginResponse.text());
    }

    expect(loginResponse.ok()).toBeTruthy();
    
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token; 
    console.log("Extracted Token:", token);

    // ==========================================
    // STEP 2 — Fetch events via API to get a valid event ID
    // ==========================================
    const eventResponse = await apiContext.get("https://api.eventhub.rahulshettyacademy.com/api/events", {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    expect(eventResponse.ok()).toBeTruthy();
    
    const eventResponseJson = await eventResponse.json();
    eventId = eventResponseJson.data[0].id; 
    console.log("Extracted Event ID:", eventId);

    // ==========================================
    // STEP 3 — Create a booking via API as Yahoo user
    // ==========================================
    const bookingPayLoad = {
        eventId: eventId,
        customerName: "Sidhu Reddy",
        customerEmail: "sidhu@yahoo.com",
        customerPhone: "1224567890",
        quantity: 1
    };

    const bookingResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/bookings", {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: bookingPayLoad,
        timeout: 60000
    });

    expect(bookingResponse.ok()).toBeTruthy();
    
    const bookingResponseJson = await bookingResponse.json();
    yahooBookingId = bookingResponseJson.data.id; 
    console.log("Yahoo Booking ID created successfully:", yahooBookingId);
    
    // ❌ REMOVED page.pause() from here since 'page' does not exist in beforeAll
});

// ==========================================
// User with no such booking id, trying to see other user booking - Scenario without page.route
// ==========================================
test('Execute UI Authentication Guardrail Workflow', async ({ page }) => {
    
    // STEP 4 — Login as Gmail user via browser UI
    await loginAs(page);
     
    // STEP 5 — Navigate to Yahoo's booking URL as Gmail user dynamically
    // Fixed: Changed to backticks and pointed to the frontend UI URL structure
    await page.goto(`https://eventhub.rahulshettyacademy.com/bookings/${yahooBookingId}`, { 
        waitUntil: 'networkidle' 
    });

    // This pause will open Playwright Inspector perfectly so you can step through the assertions!
    await page.pause();

    // STEP 6 — Validate Access Denied
    await expect(page.getByText("Access Denied")).toBeVisible();
    await expect(page.getByText("You are not authorized to view this booking")).toBeVisible();
});