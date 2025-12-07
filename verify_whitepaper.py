from playwright.sync_api import sync_playwright

def verify_whitepaper():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the Whitepaper page
            page.goto("http://localhost:3000/whitepaper")

            # Wait for content to load
            page.wait_for_selector("text=Sách Trắng (Whitepaper)")

            # Take a screenshot
            page.screenshot(path="/home/jules/verification/whitepaper.png", full_page=True)
            print("Screenshot taken successfully")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_whitepaper()
