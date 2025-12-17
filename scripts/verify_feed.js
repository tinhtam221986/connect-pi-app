const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || '3000';

(async () => {
  console.log(`Starting Feed verification on port ${PORT}...`);
  const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (!text.includes('[Fast Refresh]')) {
          console.log(`[PAGE ${type.toUpperCase()}] ${text}`);
      }
  });

  try {
    const url = `http://localhost:${PORT}`;
    console.log(`Navigating to ${url}`);
    await page.goto(url, { timeout: 60000 });

    // Login logic
    console.log("Looking for DEV button...");
    const devBtn = page.getByText('DEV', { exact: true });
    await devBtn.waitFor({ state: 'visible', timeout: 10000 });
    await devBtn.click({ force: true });

    console.log("Waiting for Main View...");
    await page.waitForSelector('nav', { timeout: 10000 });

    // Feed is the default view.
    // Wait for video description
    console.log("Waiting for video feed content...");
    const descriptionSelector = 'p.line-clamp-2'; // From VideoFeed.tsx
    // Or just look for text "Dev Mode"

    // We expect "Dev Mode: DB not connected."
    await page.waitForSelector('text=Dev Mode: DB not connected', { timeout: 10000 });

    console.log("SUCCESS: Found mock video in feed.");
    await page.screenshot({ path: 'verification/step4_feed_success.png' });

  } catch (error) {
    console.error("Feed Verification failed:", error);
    await page.screenshot({ path: 'verification/feed_failure.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
