from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to home
        page.goto("http://localhost:3000")
        
        # Wait for login screen (Pi Network or Mock)
        page.wait_for_selector("text=Connect with Pi Network", timeout=10000)
        
        # Take screenshot of Login
        page.screenshot(path="login_view.png")
        print("Login screenshot taken.")
        
        # Mock Login (since we can't do real Pi auth in headless)
        # We need to simulate the "Force Mock Mode" if it exists, or check the UI state
        # Based on pi-provider.tsx, if we are in dev, we might see a bypass.
        # But let's just capture the login screen to verify the "Setup Required" 
        # or normal login state.
        
        browser.close()

if __name__ == "__main__":
    verify_frontend()
