#!/bin/bash

# Smart Energy Meter API Test Script
# This script tests all API endpoints

BASE_URL="http://localhost:3000/api"

echo "=========================================="
echo "Smart Energy Meter API Test Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET $BASE_URL/health"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET $BASE_URL/health)
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 2: Send Energy Data (Full)
echo -e "${YELLOW}Test 2: Send Energy Data (Full Payload)${NC}"
echo "POST $BASE_URL/energy-data"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientTIN": "",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120,
    "voltage": 230.5,
    "current": 5.2,
    "power": 1200.0,
    "totalEnergy": 150.5,
    "frequency": 50.0,
    "powerFactor": 0.95,
    "timestamp": 1703123456789
  }')
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 3: Send Energy Data (Minimal)
echo -e "${YELLOW}Test 3: Send Energy Data (Minimal Required Fields)${NC}"
echo "POST $BASE_URL/energy-data"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 3.456,
    "sessionDuration": 180
  }')
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 4: Get All Energy Data
echo -e "${YELLOW}Test 4: Get All Energy Data${NC}"
echo "GET $BASE_URL/energy-data"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET $BASE_URL/energy-data)
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 5: Get Energy Data (Filtered)
echo -e "${YELLOW}Test 5: Get Energy Data (Filtered by Meter Number)${NC}"
echo "GET $BASE_URL/energy-data?meterNumber=0215002079873&limit=5"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$BASE_URL/energy-data?meterNumber=0215002079873&limit=5")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 6: Get Meter Data
echo -e "${YELLOW}Test 6: Get Latest Data for Specific Meter${NC}"
echo "GET $BASE_URL/energy-data/0215002079873"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET $BASE_URL/energy-data/0215002079873)
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "200" ] || [ "$http_code" == "404" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 7: Error Test - Missing Fields
echo -e "${YELLOW}Test 7: Error Handling - Missing Required Fields${NC}"
echo "POST $BASE_URL/energy-data"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873"
  }')
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "400" ]; then
    echo -e "${GREEN}✓ PASSED (Correctly returned 400)${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (Expected 400, got $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 8: Error Test - Invalid Meter Number
echo -e "${YELLOW}Test 8: Error Handling - Invalid Meter Number Format${NC}"
echo "POST $BASE_URL/energy-data"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "12345",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120
  }')
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "400" ]; then
    echo -e "${GREEN}✓ PASSED (Correctly returned 400)${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (Expected 400, got $http_code)${NC}"
    echo "$body"
fi
echo ""

# Test 9: Error Test - Invalid Token
echo -e "${YELLOW}Test 9: Error Handling - Invalid Token Format${NC}"
echo "POST $BASE_URL/energy-data"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "12345",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120
  }')
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')
if [ "$http_code" == "400" ]; then
    echo -e "${GREEN}✓ PASSED (Correctly returned 400)${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ FAILED (Expected 400, got $http_code)${NC}"
    echo "$body"
fi
echo ""

echo "=========================================="
echo "Testing Complete"
echo "=========================================="
