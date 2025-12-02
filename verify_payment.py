import requests
import sys

BASE_URL = "http://localhost:3000/api"

def test_payment_endpoints():
    print("Testing Payment Endpoints...")

    # 1. Test Approve
    try:
        res = requests.post(f"{BASE_URL}/payment/approve", json={"paymentId": "test_123"})
        if res.status_code == 200:
             print("✅ Payment Approve Endpoint works")
        else:
             print(f"❌ Payment Approve failed: {res.status_code}")
    except Exception as e:
        print(f"❌ Payment Approve error: {e}")

    # 2. Test Complete
    try:
        res = requests.post(f"{BASE_URL}/payment/complete", json={"paymentId": "test_123", "txid": "tx_abc"})
        if res.status_code == 200:
             print("✅ Payment Complete Endpoint works")
        else:
             print(f"❌ Payment Complete failed: {res.status_code}")
    except Exception as e:
        print(f"❌ Payment Complete error: {e}")

if __name__ == "__main__":
    test_payment_endpoints()
