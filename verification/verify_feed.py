from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        print("Navigating to localhost:3000...")
        try:
            page.goto("http://localhost:3000", timeout=30000)
        except Exception as e:
            print(f"Error navigating: {e}")
            browser.close()
            return

        # Login Flow
        print("Checking for Login Screen...")
        try:
            # Wait for any content
            page.wait_for_selector('h1:has-text("CONNECT")', timeout=10000)

            # Click DEV / Force Mock Mode to bypass Pi SDK check
            dev_btn = page.locator('button[title="Force Mock Mode"]')
            if dev_btn.is_visible():
                print("Clicking Force Mock Mode (DEV) Button...")
                dev_btn.click()
            else:
                print("DEV button not found. Checking if main login is enabled...")
                # Fallback to main login if DEV button hidden (unlikely per code)
                checkbox = page.locator('input[type="checkbox"]')
                if checkbox.is_visible(): checkbox.click()
                page.click('button:has-text("Login with Pi")')

            # Wait for Feed
            print("Waiting for Feed (.video-item-container)...")
            page.wait_for_selector('.video-item-container', timeout=30000)
            print("Feed loaded.")

        except Exception as e:
            print(f"Login failed or timed out: {e}")
            page.screenshot(path="verification/login_fail.png")
            browser.close()
            return

        # Verify UI Elements
        results = []
        ui_passed = True

        # 1. TopNav Avatar
        try:
            # Look for avatar image in header area
            avatar = page.locator('img[alt="Profile"]')
            if avatar.is_visible():
                results.append("PASS: Avatar found in TopNav")
            else:
                results.append("FAIL: Avatar NOT found in TopNav")
                ui_passed = False
        except:
            results.append("FAIL: Error checking Avatar")
            ui_passed = False

        # 2. Shop Button (Bottom Left)
        try:
            # Search for button with text "Shop"
            shop = page.locator('button:has-text("Shop")')
            if shop.is_visible():
                results.append("PASS: Shop Button found")
            else:
                results.append("FAIL: Shop Button NOT found")
                ui_passed = False
        except:
            results.append("FAIL: Error checking Shop Button")
            ui_passed = False

        # 3. Create Button (Bottom Right - Plus icon)
        try:
            # Look for button with Plus icon
            create_btn = page.locator('button .lucide-plus').first
            if create_btn.is_visible():
                results.append("PASS: Create Button found")
            else:
                results.append("FAIL: Create Button NOT found")
                ui_passed = False
        except:
            results.append("FAIL: Error checking Create Button")
            ui_passed = False

        print("\nVerification Results:")
        for res in results:
            print(res)

        page.screenshot(path="verification/immersive_feed_verified.png")
        browser.close()

if __name__ == "__main__":
    run()
