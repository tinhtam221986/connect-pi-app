
import os
from playwright.sync_api import Page, expect, sync_playwright

def test_app_frontend(page: Page):
    # 1. Arrange: Go to the app homepage.
    page.goto("http://localhost:3000")

    # 2. Assert: Check for "Login with Pi" or "Loading SDK..."
    # Use specific role to avoid ambiguity
    expect(page.get_by_role("heading", name="CONNECT")).to_be_visible()
    
    # Check for the button. It might say "Loading SDK..." initially.
    # We want to verify the styling and presence of components.
    expect(page.get_by_text("Web3 Video Social Network on Pi")).to_be_visible()

    # 3. Screenshot the Login View
    page.screenshot(path="login_view.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_app_frontend(page)
            print("Frontend verification passed.")
        except Exception as e:
            print(f"Frontend verification failed: {e}")
            page.screenshot(path="error.png")
            raise e
        finally:
            browser.close()
