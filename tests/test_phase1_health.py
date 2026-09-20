import unittest
import sys
import os

# Ensure backend root is in sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from fastapi.testclient import TestClient
from app.main import app

class TestPhase1HealthCheck(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_status_code(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)

    def test_health_check_payload_structure(self):
        response = self.client.get("/api/health")
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("service"), "ReLife AI Backend")
        self.assertIn("timestamp", data)
        self.assertIn("version", data)
        self.assertIn("phase", data)
        self.assertEqual(data.get("tagline"), "Diagnose. Refurbish. Resell. Don’t Discard.")

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("tagline", data)
        self.assertEqual(data.get("health_check"), "/api/health")

if __name__ == "__main__":
    unittest.main()
