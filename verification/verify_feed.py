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

        # Verify UI Elements - 12 Point Layout
        results = []
        ui_passed = True

        # 1. Back Arrow
        if page.locator('button .lucide-chevron-left').first.is_visible():
            results.append("PASS: Back Arrow found")
        else:
            results.append("FAIL: Back Arrow missing")

        # 2. Tabs (Dành cho bạn)
        if page.locator('button:has-text("Dành cho bạn")').is_visible():
            results.append("PASS: Tabs found")
        else:
            results.append("FAIL: Tabs missing")

        # 3. Create Button (Right Stack - Plus Icon)
        if page.locator('button .lucide-plus').first.is_visible():
             results.append("PASS: Create (+) Button found")
        else:
             results.append("FAIL: Create (+) Button missing")

        # 4. Disc (Spinning)
        if page.locator('.animate-\\[spin_5s_linear_infinite\\]').is_visible():
            results.append("PASS: Spinning Disc found")
        else:
            results.append("FAIL: Spinning Disc missing")

        # 5. Comment Input (Bottom)
        if page.locator('button:has-text("Bình luận...")').is_visible():
            results.append("PASS: Comment Input Bar found")
        else:
            results.append("FAIL: Comment Input Bar missing")

        # 6. Mute/Unmute Icon (Volume)
        if page.locator('button .lucide-volume-x').is_visible() or page.locator('button .lucide-volume-2').is_visible():
             results.append("PASS: Mute/Volume Icon found")
        else:
             results.append("FAIL: Mute/Volume Icon missing")

        # 7. Shop Icon (New Check)
        if page.locator('button .lucide-shopping-cart').first.is_visible():
             results.append("PASS: Shop Icon found")
        else:
             results.append("FAIL: Shop Icon missing")

        print("\nVerification Results:")
        for res in results:
            print(res)

        page.screenshot(path="verification/immersive_feed_final_v2.png")
        browser.close()

if __name__ == "__main__":
    run()
