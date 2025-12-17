const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || '3000';

(async () => {
  console.log(`Starting verification script on port ${PORT}...`);
  const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Redirect console logs from page to stdout
  page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (!text.includes('[Fast Refresh]')) {
          console.log(`[PAGE ${type.toUpperCase()}] ${text}`);
      }
  });

  page.on('pageerror', err => {
      console.error(`[PAGE ERROR] ${err}`);
  });

  try {
    const url = `http://localhost:${PORT}`;
    console.log(`Navigating to ${url}`);
    await page.goto(url, { timeout: 60000 });

    console.log("Waiting for app to load...");
    await page.waitForSelector('h1', { timeout: 30000 });
    const title = await page.locator('h1').textContent();
    console.log(`Found title: ${title}`);

    // Take initial screenshot
    if (!fs.existsSync('verification')) fs.mkdirSync('verification');
    await page.screenshot({ path: 'verification/step1_loaded.png' });

    console.log("Looking for DEV button...");
    const devBtn = page.getByText('DEV', { exact: true });

    // Wait for button to be stable
    await devBtn.waitFor({ state: 'visible', timeout: 10000 });

    console.log("Attempting to login...");
    let loggedIn = false;
    for (let i = 0; i < 5; i++) {
        console.log(`Clicking DEV button (attempt ${i+1})...`);
        try {
            await devBtn.click({ force: true });
            // Wait a bit for state update
            await page.waitForTimeout(1000);

            // Check if Nav appeared
            const nav = page.locator('nav');
            if (await nav.count() > 0 && await nav.isVisible()) {
                console.log("Navigation successful! Main View is active.");
                loggedIn = true;
                break;
            }
        } catch (e) {
            console.log(`Attempt ${i+1} failed/timed out: ${e.message}`);
        }
    }

    if (!loggedIn) {
        throw new Error("Failed to log in after 5 attempts");
    }

    await page.screenshot({ path: 'verification/step2_logged_in.png' });

    // Navigate to Profile
    console.log("Clicking 'Me' tab...");
    await page.getByLabel('Me', { exact: true }).click();

    console.log("Waiting for Profile View...");
    await page.waitForSelector('h2', { timeout: 10000 });

    const content = await page.content();
    if (content.includes('MockUser')) {
        console.log("SUCCESS: Found 'MockUser' in profile.");
    } else {
        console.error("FAILURE: 'MockUser' not found in profile.");
        // Log content snippet
        console.log("Page Content Snippet:", content.slice(0, 500));
    }

    if (content.includes('Followers')) {
        console.log("SUCCESS: Profile stats structure found.");
    }

    await page.screenshot({ path: 'verification/step3_profile.png' });

  } catch (error) {
    console.error("Verification failed:", error);
    await page.screenshot({ path: 'verification/fatal_error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
