# API Testing Guide

This document provides examples for testing the User Management API using cURL, Postman, or JavaScript.

## Base URL
```
http://localhost:3001/api
```

## Testing with cURL

### 1. Get All Users (with pagination)
```bash
# Get first page (10 users)
curl http://localhost:3001/api/users

# Get page 2 with 5 users per page
curl "http://localhost:3001/api/users?page=2&limit=5"

# Get users sorted by name ascending
curl "http://localhost:3001/api/users?sortField=name&sortOrder=asc"

# Search for users
curl "http://localhost:3001/api/users?search=john"

# Combine parameters
curl "http://localhost:3001/api/users?page=1&limit=10&sortField=email&sortOrder=desc&search=developer"
```

### 2. Get Single User
```bash
# Replace {id} with actual user ID
curl http://localhost:3001/api/users/1
```

### 3. Create New User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "Tester",
    "department": "Engineering"
  }'
```

### 4. Update User
```bash
# Replace {id} with actual user ID
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "Senior Developer",
    "department": "Engineering"
  }'
```

### 5. Delete User
```bash
# Replace {id} with actual user ID
curl -X DELETE http://localhost:3001/api/users/1
```

## Testing with JavaScript (Browser Console)

### 1. Get All Users
```javascript
fetch('http://localhost:3001/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### 2. Create User
```javascript
fetch('http://localhost:3001/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'JavaScript Test',
    email: 'jstest@example.com',
    role: 'Developer',
    department: 'Engineering'
  })
})
  .then(res => res.json())
  .then(data => console.log('Created:', data))
  .catch(err => console.error(err));
```

### 3. Update User
```javascript
const userId = 1; // Replace with actual ID

fetch(`http://localhost:3001/api/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Updated via JS',
    email: 'updated@example.com',
    role: 'Lead Developer',
    department: 'Engineering'
  })
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data))
  .catch(err => console.error(err));
```

### 4. Delete User
```javascript
const userId = 1; // Replace with actual ID

fetch(`http://localhost:3001/api/users/${userId}`, {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log('Deleted:', data))
  .catch(err => console.error(err));
```

## Postman Collection

### Setup
1. Open Postman
2. Create a new Collection named "User Management API"
3. Set Base URL variable: `{{baseUrl}}` = `http://localhost:3001/api`

### Requests to Add

#### 1. GET All Users
- Method: GET
- URL: `{{baseUrl}}/users`
- Params: page=1, limit=10

#### 2. GET User by ID
- Method: GET
- URL: `{{baseUrl}}/users/:id`
- Path Variable: id = 1

#### 3. POST Create User
- Method: POST
- URL: `{{baseUrl}}/users`
- Headers: Content-Type = application/json
- Body (raw JSON):
```json
{
  "name": "Postman Test",
  "email": "postman@example.com",
  "role": "QA Engineer",
  "department": "Engineering"
}
```

#### 4. PUT Update User
- Method: PUT
- URL: `{{baseUrl}}/users/:id`
- Path Variable: id = 1
- Headers: Content-Type = application/json
- Body (raw JSON):
```json
{
  "name": "Updated via Postman",
  "email": "updated@example.com",
  "role": "Senior QA Engineer",
  "department": "Engineering"
}
```

#### 5. DELETE User
- Method: DELETE
- URL: `{{baseUrl}}/users/:id`
- Path Variable: id = 1

## Testing Scenarios

### Test Case 1: Pagination
```bash
# Get total count
curl http://localhost:3001/api/users | jq '.totalUsers'

# Get first 5
curl "http://localhost:3001/api/users?limit=5" | jq '.users | length'

# Get second page of 5
curl "http://localhost:3001/api/users?page=2&limit=5" | jq '.users[0].id'
```

### Test Case 2: Sorting
```bash
# Sort by name ascending
curl "http://localhost:3001/api/users?sortField=name&sortOrder=asc" | jq '.users[0].name'

# Sort by created_at descending (newest first)
curl "http://localhost:3001/api/users?sortField=created_at&sortOrder=desc" | jq '.users[0]'
```

### Test Case 3: Search
```bash
# Search for "developer"
curl "http://localhost:3001/api/users?search=developer" | jq '.totalUsers'

# Search for specific email domain
curl "http://localhost:3001/api/users?search=example.com" | jq '.users | length'
```

### Test Case 4: Validation Errors
```bash
# Missing required field
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}' | jq

# Invalid email format
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "role": "Developer",
    "department": "Engineering"
  }' | jq

# Duplicate email
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate",
    "email": "john@example.com",
    "role": "Developer",
    "department": "Engineering"
  }' | jq
```

### Test Case 5: Not Found
```bash
# Try to get non-existent user
curl http://localhost:3001/api/users/99999 | jq

# Try to update non-existent user
curl -X PUT http://localhost:3001/api/users/99999 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "role": "Developer",
    "department": "Engineering"
  }' | jq

# Try to delete non-existent user
curl -X DELETE http://localhost:3001/api/users/99999 | jq
```

## Expected Response Formats

### Success Responses

#### GET All Users
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Developer",
      "department": "Engineering",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalUsers": 15,
  "totalPages": 2,
  "currentPage": 1
}
```

#### GET Single User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Developer",
  "department": "Engineering",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### POST Create User (Status: 201)
```json
{
  "id": 16,
  "name": "New User",
  "email": "new@example.com",
  "role": "Developer",
  "department": "Engineering",
  "created_at": "2024-01-02T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

#### PUT Update User
```json
{
  "id": 1,
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "Senior Developer",
  "department": "Engineering",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

#### DELETE User
```json
{
  "message": "User deleted successfully"
}
```

### Error Responses

#### Validation Error (Status: 400)
```json
{
  "error": "All fields are required"
}
```

#### Duplicate Email (Status: 400)
```json
{
  "error": "Email already exists"
}
```

#### Not Found (Status: 404)
```json
{
  "error": "User not found"
}
```

#### Server Error (Status: 500)
```json
{
  "error": "Internal server error message"
}
```

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test GET endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:3001/api/users

# Test with authentication header if needed
ab -n 100 -c 10 -H "Authorization: Bearer token" http://localhost:3001/api/users
```

### Simple Load Test with cURL
```bash
# Create multiple users quickly
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/users \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Load Test $i\",
      \"email\": \"loadtest$i@example.com\",
      \"role\": \"Tester\",
      \"department\": \"Engineering\"
    }"
done
```

## Troubleshooting API Issues

### Issue: CORS Error
**Solution:** Ensure server is running and CORS is enabled in server.js

### Issue: 500 Internal Server Error
**Check:**
1. MySQL server is running
2. Database exists
3. Server logs for detailed error message

### Issue: Cannot connect to server
**Check:**
1. Server is running on correct port
2. No firewall blocking the port
3. Correct API URL in requests

### Issue: Validation always failing
**Check:**
1. Request Content-Type header is set to `application/json`
2. Request body is valid JSON
3. All required fields are included
