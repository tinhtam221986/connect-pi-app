from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_feed(page: Page):
    print("Navigating to home (port 3001)...")
    page.goto("http://localhost:3001")

    # Check if we are on Login page
    # Look for the Welcome text or the DEV button
    try:
        # Wait briefly to see if login elements appear
        page.wait_for_selector("text=Chào mừng bạn", timeout=5000)
        print("Login page detected.")

        # Click DEV button to force mock login
        dev_btn = page.locator('button[title="Force Mock Mode"]')
        if dev_btn.is_visible():
            print("Clicking DEV button...")
            dev_btn.click()
        else:
            print("DEV button not found, maybe loading SDK?")

    except:
        print("Login page not detected or timed out waiting for it (maybe already logged in?)")

    # Wait for feed to load (video items)
    print("Waiting for video items...")
    page.wait_for_selector(".video-item-container", timeout=30000)

    # Check bottom input bar is GONE
    print("Checking for absence of bottom input bar...")
    count = page.get_by_text("Bình luận...").count()
    if count > 0:
        # Check if it's visible
        if page.get_by_text("Bình luận...").is_visible():
             raise Exception("Bottom input bar still found and visible!")

    # Check for Clusters
    print("Checking for clusters...")
    # Tier 3: Shop and Market buttons
    # Note: These might take a moment to render if video data is fetching
    expect(page.get_by_text("Shop")).to_be_visible()
    expect(page.get_by_text("Market")).to_be_visible()

    # Check for Right Sidebar
    print("Checking right sidebar...")
    # Disc - look for spinning element or music icon
    expect(page.locator(".animate-\[spin_5s_linear_infinite\]")).to_be_visible()

    # Take screenshot
    print("Taking screenshot...")
    time.sleep(3)
    page.screenshot(path="verification.png")
    print("Done.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile viewport
        context = browser.new_context(viewport={"width": 375, "height": 667})
        page = context.new_page()
        try:
            verify_feed(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error.png")
        finally:
            browser.close()
