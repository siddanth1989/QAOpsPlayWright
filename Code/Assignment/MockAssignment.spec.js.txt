const { test, expect } = require('@playwright/test');

// =========================================================================
// 1. GLOBAL HELPER FUNCTION (Must be outside/above the test block)
// =========================================================================
async function loginAndGoToEvents(page) {
    await page.goto('https://eventhub.rahulshettyacademy.com/');
    await page.locator('#email').fill('siddanth1989@gmail.com');
    await page.locator('#password').fill('#Rohit45');
    await page.locator("#login-btn").click();
    
    // Wait for the login actions and initial auth redirection network calls to settle
    await page.waitForLoadState('networkidle');
    
    // Explicitly navigate to the events page
    await page.goto('https://eventhub.rahulshettyacademy.com/events');
}
    //MOCK TEST DATA

    const SIX_EVENTS_RESPONSE = {
        data: [
            { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
            { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
            { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
            { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
            { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
            { id: 6, title: 'AI & ML Expo',    category: 'Conference',  eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
        ],
        pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
    };

    const FOUR_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
    };

    // =========================================================================
    // THE TEST CASEs
    // =========================================================================
test('Test 1 - Banner is Visible with 6 events', async ({ page }) => {

    // ---------------------------------------------------------------------
    // STEP 1 — SET UP THE API MOCK (First thing executed inside the test)
    // ---------------------------------------------------------------------
    // Using a regular expression ensures that if the app calls /api/events?limit=12, 
    // it will still be caught perfectly by our mock handler.
    await page.route('https://api.eventhub.rahulshettyacademy.com/api/events*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(SIX_EVENTS_RESPONSE)
        });
    });

    // ---------------------------------------------------------------------
    // STEP 2 — LOGIN AND NAVIGATE
    // ---------------------------------------------------------------------
    await loginAndGoToEvents(page);

    // ---------------------------------------------------------------------
    // STEP 3 — VERIFY CARDS LOADED FROM MOCK
    // ---------------------------------------------------------------------

    await page.pause();

    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();
    await expect(eventCards).toHaveCount(6); 


    // ---------------------------------------------------------------------
    // STEP 4 — VERIFY BANNER IS VISIBLE
    // ---------------------------------------------------------------------
    await page.pause();

    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('9 bookings');

    await page.pause();
    // Log 2: Confirming the banner state
    console.log('[TEST 1] ✨ SUCCESS: Sandbox warning banner IS visible on the UI (6 events loaded).');
});

test('Test 2 - Banner is Not Visible with 4 events', async ({ page }) => {

    // ---------------------------------------------------------------------
    // STEP 1 — SET UP THE API MOCK (First thing executed inside the test)
    // ---------------------------------------------------------------------
    // Using a regular expression ensures that if the app calls /api/events?limit=12, 
    // it will still be caught perfectly by our mock handler.
    await page.route('https://api.eventhub.rahulshettyacademy.com/api/events*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(FOUR_EVENTS_RESPONSE)
        });
    });

    // ---------------------------------------------------------------------
    // STEP 2 — LOGIN AND NAVIGATE
    // ---------------------------------------------------------------------
    await loginAndGoToEvents(page);

    // ---------------------------------------------------------------------
    // STEP 3 — VERIFY CARDS LOADED FROM MOCK
    // ---------------------------------------------------------------------

    await page.pause();

    // Assertions now accurately check for 4 items instead of 6
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();
    await expect(eventCards).toHaveCount(4);


    // ---------------------------------------------------------------------
    // STEP 4 — VERIFY BANNER IS VISIBLE
    // ---------------------------------------------------------------------
    await page.pause();

    // Asserting that the banner is completely hidden (based on your g.length > 5 discovery!)
    const banner = page.getByText(/sandbox holds up to/i);
    await expect(banner).toBeHidden();

    await page.pause();

    // Log 2: Confirming the banner state
    console.log('[TEST 2] ✨ SUCCESS: Sandbox warning banner IS NOT visible on the UI (4 events loaded).');
});