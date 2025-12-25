from playwright.sync_api import sync_playwright

def verify_feed_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport to match the Pi Browser / Mobile context
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        # Mock the /api/feed endpoint
        page.route("**/api/feed", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body="""[
                {
                    "id": "video1",
                    "url": "https://example.com/video1.mp4",
                    "resourceType": "video",
                    "username": "demo_user",
                    "description": "This is a demo video description to test the UI layout.",
                    "likes": ["user1", "user2"],
                    "comments": ["c1", "c2", "c3"]
                }
            ]"""
        ))

        # Mock auth to appear logged in
        page.route("**/api/auth/verify", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"user": {"uid": "me", "username": "current_user", "balance": 100}}'
        ))

        # Mock user profile
        page.route("**/api/user/profile**", lambda route: route.fulfill(
             status=200,
             content_type="application/json",
             body='{"user": {"uid": "me", "username": "current_user", "balance": 100}}'
        ))

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000/")

            # Wait for the feed to load (VideoFeed uses apiClient.feed.get)
            # We look for the username in the UI to confirm load
            print("Waiting for feed content...")
            page.wait_for_selector("text=@demo_user", timeout=10000)

            # Additional checks for new UI elements
            print("Verifying UI elements...")

            # Check for the Shop icon (Store)
            if page.get_by_text("Shop").is_visible():
                print("Shop icon visible.")

            # Check for the Disc
            if page.locator(".animate-[spin_4s_linear_infinite]").is_visible():
                print("Rotating disc visible.")

            # Check for Right Sidebar icons
            # Heart, MessageCircle, Share2, Bookmark are generic names, look for svgs or parent classes
            # We can check for the like count "2"
            if page.get_by_text("2", exact=True).is_visible():
                 print("Like count visible.")

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification_feed.png")
            print("Screenshot saved to verification_feed.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_feed_ui()
