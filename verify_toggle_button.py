import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    # Ensure the verification directory exists
    os.makedirs('/home/jules/verification', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},  # iPhone 13 Pro dimensions
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        # Capture console messages
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

        try:
            # Navigate to the app
            print("Navigating to http://localhost:8080...")
            await page.goto('http://localhost:8080', timeout=60000)

            # Wait for the login screen to appear and find the DEV button
            print("Waiting for login screen...")
            dev_button = page.locator('button:has-text("DEV")')
            await dev_button.wait_for(state='visible', timeout=30000)
            print("Login screen loaded. Clicking DEV button...")

            # Click the DEV button to force mock mode
            await dev_button.click()

            # Wait for the main feed to load after authentication
            print("Waiting for main feed to load...")
            await page.wait_for_selector('div[data-testid="video-feed"]', timeout=30000)
            print("Main feed loaded.")

            # Give the UI a moment to settle for animations
            await page.wait_for_timeout(2000)

            # Take a screenshot of the main feed
            screenshot_path = '/home/jules/verification/main_feed_with_toggle.png'
            print(f"Taking screenshot: {screenshot_path}")
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path='/home/jules/verification/error_screenshot.png')
            print("Error screenshot saved.")
        finally:
            await browser.close()
            print("Browser closed.")

if __name__ == '__main__':
    asyncio.run(main())
