from playwright.sync_api import sync_playwright

def verify_upload_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile viewport since it's a mobile-first app
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        try:
            # 1. Navigate to Upload Page
            print("Navigating to /upload...")
            page.goto("http://localhost:3000/upload")

            # Wait for key elements to ensure render
            page.wait_for_selector("text=Chọn video", timeout=10000)

            # 2. Screenshot the Initial State (Upload Prompt)
            print("Taking screenshot of Upload Prompt...")
            page.screenshot(path="verification/upload_initial.png")

            # 3. We cannot easily simulate a file upload in headless mode without a real file path
            # and interacting with system dialogs, but we can verify the 'input' element exists.
            input_element = page.locator('input[type="file"]')
            if input_element.count() > 0:
                print("✅ File input element found.")
            else:
                print("❌ File input element NOT found.")

        except Exception as e:
            print(f"❌ Verification failed: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_upload_ui()
