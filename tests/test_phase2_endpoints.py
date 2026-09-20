import unittest
import sys
import os

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from fastapi.testclient import TestClient
from app.main import app

class TestPhase2Endpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_list_devices(self):
        res = self.client.get("/api/devices")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_register_device(self):
        payload = {
            "manufacturer": "HP",
            "model": "EliteBook 840 G5",
            "cpu": "Intel Core i5-8350U",
            "ram_gb": 16.0,
            "storage_gb": 256.0,
            "storage_type": "NVMe SSD",
            "os": "Windows 11 Pro",
            "is_demo": False
        }
        res = self.client.post("/api/devices/register", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["model"], "EliteBook 840 G5")
        self.assertIn("serial_hash", data)

    def test_trigger_diagnostics(self):
        res = self.client.post("/api/devices/dev-demo-001/diagnostics")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("overall_score", data)
        self.assertIn("cpu", data)
        self.assertIn("ram", data)
        self.assertIn("storage", data)

    def test_battery_prediction(self):
        res = self.client.post("/api/devices/dev-demo-001/battery/predict")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("estimated_soh", data)
        self.assertIn("estimated_remaining_cycles", data)

    def test_valuation(self):
        res = self.client.post("/api/devices/dev-demo-001/valuation")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("estimated_low", data)
        self.assertIn("estimated_high", data)
        self.assertEqual(data["currency"], "INR")

    def test_refurbishment_decision(self):
        res = self.client.post("/api/devices/dev-demo-001/refurbishment")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data["decision"], ["REFURBISH", "RECYCLE", "SALVAGE"])

    def test_passport_generation_and_verification(self):
        # Generate
        res = self.client.post("/api/devices/dev-demo-001/passport")
        self.assertEqual(res.status_code, 200)
        p = res.json()
        passport_id = p["passport_id"]

        # Retrieve
        res2 = self.client.get(f"/api/passports/{passport_id}")
        self.assertEqual(res2.status_code, 200)

        # Verify
        res3 = self.client.get(f"/api/passports/{passport_id}/verify")
        self.assertEqual(res3.status_code, 200)
        self.assertTrue(res3.json()["verified"])

if __name__ == "__main__":
    unittest.main()
