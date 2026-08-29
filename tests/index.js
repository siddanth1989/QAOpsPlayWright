// index.js
// Scrapes the dashboard and sends test emails using the Outlook configuration.

import { chromium } from '@playwright/test';
import 'dotenv/config'; // Load environment variables from .env
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';

// --- Configuration Constants from .env ---
const DASHBOARD_URL = process.env.DASHBOARD_URL;
const AUTH_FILE = process.env.AUTH_FILE;
const SENDER_EMAIL = process.env.EMAIL_SENDER;
const SENDER_PASS = process.env.EMAIL_SENDER_PASS;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_PORT = process.env.EMAIL_PORT;
const TEST_RECIPIENT = process.env.TEST_RECIPIENT_EMAIL;

// Use import.meta.url for current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, 'images');

// --- Nodemailer Email Sending Function (Outlook Config) ---

/**
 * Sends a celebration email to the TEST_RECIPIENT address.
 * @param {string} recipientName - The name of the employee for personalization.
 * @param {('Birthday'|'Anniversary')} eventType - The type of event.
 */
async function sendCelebrationEmail(recipientName, eventType) {
    if (!SENDER_EMAIL || !SENDER_PASS) {
        console.error('Email credentials are not set in .env. Skipping email sending.');
        return;
    }

    // 1. Setup the transporter using explicit Outlook SMTP settings
    let transporter = nodemailer.createTransport({
        host: EMAIL_SERVICE, // smtp.office365.com
        port: EMAIL_PORT,   // 587
        secure: false, // TLS is used on port 587, so 'secure' is false
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASS 
        },
        tls: {
            // Required for O365 compatibility, though often optional
            ciphers: 'SSLv3' 
        }
    });

    const subject = `[TEST] ${eventType} Wishes for ${recipientName} 🎉 (Automation Check)`;
    // Create a placeholder image path (assuming you create an 'images' folder)
    const imageFilename = eventType === 'Birthday' ? 'birthday_placeholder.jpg' : 'anniversary_placeholder.jpg';
    const imagePath = path.join(imageDir, imageFilename);

    // Placeholder check: In a real scenario, you'd ensure this file exists.
    // For this example, we assume you've created a dummy image in the 'images' folder.

    const mailOptions = {
        from: `"HR Automation Test" <${SENDER_EMAIL}>`,
        // *** CRITICAL FOR TESTING: Send to your personal email ***
        to: TEST_RECIPIENT, 
        
        subject: subject,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h1 style="color: #4CAF50;">Happy ${eventType}!</h1>
                <p>Dear **${recipientName}**, </p>
                <p>Wishing you a very happy **${eventType}**! </p>
                <p style="color: red; font-style: italic;">(This is a test email sent to **${TEST_RECIPIENT}** from your account **${SENDER_EMAIL}**.)</p>
                <!-- Include the image if it exists -->
                <!-- <img src="cid:celebrationImage" alt="${eventType} Image" style="width: 100%; max-width: 400px; border-radius: 4px; margin-top: 15px;"> -->
                <p>--- End of Test Content ---</p>
              </div>
            </body>
          </html>
        `,
        // Attachments block commented out for simplicity in testing unless you confirm file path
        /*
        attachments: [{
            filename: imageFilename,
            path: imagePath,
            cid: 'celebrationImage' // Links the image in the HTML via cid
        }]
        */
    };

    console.log(`Attempting to send a test email for ${recipientName} to ${TEST_RECIPIENT}...`);

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`✅ Test Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error('❌ Failed to send test email via Outlook. Error:', error.message);
    }
}

// --- Playwright Scraping Logic ---

async function scrapeAndEmail() {
    console.log('Starting data scraping process...');

    // Launch browser and load saved state
    const browser = await chromium.launch({ headless: true }); // Set to false to watch the process
    const context = await browser.newContext({ storageState: AUTH_FILE });
    const page = await context.newPage();

    try {
        await page.goto(DASHBOARD_URL);
        console.log('Navigated to dashboard using saved session.');

        // Wait for the "Upcoming Events" section to load (right sidebar)
        const eventsContainer = page.locator('.col-md-3'); // Common class for sidebar columns
        await eventsContainer.waitFor({ state: 'visible' });

        const events = [];

        // 1. Scraping Upcoming Birthdays
        // Locate the section based on the 'Upcoming Birthdays' header
        const bdaySection = eventsContainer.locator('h4', { hasText: 'Upcoming Birthdays' }).locator('xpath=..');
        
        if (await bdaySection.isVisible()) {
            console.log('Found Upcoming Birthdays section. Extracting names...');
            // Find all list items (assuming a common structure like <li> or <div> inside the section)
            // We use a general locator that should grab the name/date lines
            const bdayListItems = bdaySection.locator('div.col-md-12 p'); 

            const bdayCount = await bdayListItems.count();
            for (let i = 0; i < bdayCount; i++) {
                const text = await bdayListItems.nth(i).innerText();
                // Text format is likely "Name, Date" (e.g., "Lakshmi Kasa, Nov 09")
                const nameMatch = text.match(/^(.+?)\s*,\s*(\w+\s+\d+)$/);
                if (nameMatch) {
                    const name = nameMatch[1].trim();
                    console.log(`  -> Birthday Event: ${name}`);
                    events.push({ name, eventType: 'Birthday' });
                }
            }
        } else {
            console.log('Upcoming Birthdays section not found or empty.');
        }

        // 2. Scraping Upcoming Work Anniversaries
        // Locate the section based on the 'Upcoming Work Anniversaries' header
        const anniversarySection = eventsContainer.locator('h4', { hasText: 'Upcoming Work Anniversaries' }).locator('xpath=..');
        
        if (await anniversarySection.isVisible()) {
            console.log('Found Upcoming Work Anniversaries section. Extracting names...');
            // Find all list items
            const anniversaryListItems = anniversarySection.locator('div.col-md-12 p'); 

            const anniversaryCount = await anniversaryListItems.count();
            for (let i = 0; i < anniversaryCount; i++) {
                const text = await anniversaryListItems.nth(i).innerText();
                const nameMatch = text.match(/^(.+?)\s*,\s*(\w+\s+\d+)$/);
                if (nameMatch) {
                    const name = nameMatch[1].trim();
                    console.log(`  -> Anniversary Event: ${name}`);
                    events.push({ name, eventType: 'Anniversary' });
                }
            }
        } else {
            console.log('Upcoming Work Anniversaries section not found or empty.');
        }

        // --- Send Test Emails ---
        if (events.length === 0) {
            console.log('No upcoming events found today to send test emails.');
        } else {
            console.log(`\nFound ${events.length} total events. Sending test emails to ${TEST_RECIPIENT}...`);
            for (const event of events) {
                await sendCelebrationEmail(event.name, event.eventType);
            }
        }

    } catch (error) {
        console.error('An error occurred during scraping or navigation:', error.message);
    } finally {
        await browser.close();
        console.log('Browser closed. Scraping process finished.');
    }
}

// Execute the main function
scrapeAndEmail();