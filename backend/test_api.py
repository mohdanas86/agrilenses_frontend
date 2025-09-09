"""
Test script for PlantAI Backend API
Run this after starting the backend server to verify all endpoints work
"""

import requests
import json
import sys
from datetime import datetime

BASE_URL = "http://127.0.0.1:8080"

def test_endpoint(method, endpoint, data=None, files=None, description=""):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url)
        elif method.upper() == "POST":
            if files:
                response = requests.post(url, files=files)
            else:
                response = requests.post(url, json=data)
        elif method.upper() == "DELETE":
            response = requests.delete(url)
        
        print(f"✅ {method} {endpoint} - {description}")
        print(f"   Status: {response.status_code}")
        
        if response.status_code < 400:
            result = response.json()
            print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
        else:
            print(f"   Error: {response.text}")
        print()
        
        return response.status_code < 400
        
    except Exception as e:
        print(f"❌ {method} {endpoint} - {description}")
        print(f"   Error: {str(e)}")
        print()
        return False

def main():
    """Run all API tests"""
    print("🧪 Testing PlantAI Backend API")
    print("=" * 50)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code != 200:
            print("❌ Backend server is not responding properly")
            sys.exit(1)
    except:
        print("❌ Backend server is not running!")
        print("Please start the server first:")
        print("  cd backend")
        print("  python -m uvicorn main:app --host 127.0.0.1 --port 8080")
        sys.exit(1)
    
    print("✅ Backend server is running!")
    print()
    
    # Test all endpoints
    tests_passed = 0
    total_tests = 0
    
    # System APIs
    total_tests += 1
    if test_endpoint("GET", "/", description="API Information"):
        tests_passed += 1
    
    total_tests += 1
    if test_endpoint("GET", "/health", description="Health Check"):
        tests_passed += 1
    
    # Weather APIs
    total_tests += 1
    if test_endpoint("GET", "/weather/current/Delhi", description="Current Weather"):
        tests_passed += 1
        
    total_tests += 1
    if test_endpoint("GET", "/weather/forecast/Delhi", description="Weather Forecast"):
        tests_passed += 1
        
    total_tests += 1
    if test_endpoint("GET", "/weather/advisory/Delhi", description="Weather Advisory"):
        tests_passed += 1
    
    # Market Price APIs
    total_tests += 1
    if test_endpoint("GET", "/market/prices", description="Market Prices"):
        tests_passed += 1
    
    # Government Scheme APIs
    total_tests += 1
    if test_endpoint("GET", "/pmfby/policies", description="PMFBY Policies"):
        tests_passed += 1
        
    total_tests += 1
    if test_endpoint("GET", "/shc/cards", description="Soil Health Cards"):
        tests_passed += 1
    
    # Scan Management APIs
    scan_data = {
        "farmer_id": "test_farmer",
        "crop_type": "potato",
        "prediction": "Potato___Healthy",
        "confidence": 0.95,
        "recommendations": ["Continue good practices"],
        "scan_date": datetime.now().isoformat()
    }
    
    total_tests += 1
    if test_endpoint("POST", "/api/scans", data=scan_data, description="Create Scan"):
        tests_passed += 1
    
    total_tests += 1
    if test_endpoint("GET", "/api/scans", description="Get All Scans"):
        tests_passed += 1
    
    # Feedback APIs
    feedback_data = {
        "scan_id": "test_scan",
        "prediction_id": "test_prediction",
        "user_id": "test_user",
        "feedback_type": "rating",
        "rating": 5,
        "comments": "Very accurate prediction"
    }
    
    total_tests += 1
    if test_endpoint("POST", "/api/feedback", data=feedback_data, description="Submit Feedback"):
        tests_passed += 1
        
    total_tests += 1
    if test_endpoint("GET", "/api/feedback/analytics", description="Feedback Analytics"):
        tests_passed += 1
    
    # Report APIs
    total_tests += 1
    if test_endpoint("GET", "/reports/farm?farmer_id=test_farmer", description="Farm Report"):
        tests_passed += 1
    
    report_data = {"farmer_id": "test_farmer", "report_type": "monthly"}
    total_tests += 1
    if test_endpoint("POST", "/reports/pdf", data=report_data, description="PDF Report"):
        tests_passed += 1
    
    # Summary
    print("=" * 50)
    print(f"🎯 Test Results: {tests_passed}/{total_tests} passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Backend is working correctly.")
    else:
        print(f"⚠️  {total_tests - tests_passed} tests failed. Please check the issues above.")
    
    print()
    print("🔗 Interactive API Documentation:")
    print(f"   📖 Swagger UI: {BASE_URL}/docs")
    print(f"   📚 ReDoc: {BASE_URL}/redoc")

if __name__ == "__main__":
    main()
