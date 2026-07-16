# Authentication Routes

Base URL:

```text
/api/v1/auth
```

---

# Signup

Creates a new user account.

- **Method:** `POST`
- **Endpoint:** `/signup`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | User's full name |
| email | string | ✅ | User's email address |
| password | string | ✅ | User's password |

### Example Request

```http
POST /api/v1/auth/signup
Content-Type: application/json
```

```json
{
  "name": "Huzaifa Anwar",
  "email": "huzaifa@example.com",
  "password": "StrongPassword123"
}
```

---

## Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Huzaifa Anwar",
      "email": "huzaifa@example.com"
    }
  }
}
```

---

## Error Responses

### Missing Required Fields

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "All fields are required",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### Email Already Exists

**Status Code:** `409 Conflict`

```json
{
  "success": false,
  "message": "Email already exists",
  "errorCode": "USER_EXISTS"
}
```

---

### Database Unavailable

**Status Code:** `503 Service Unavailable`

```json
{
  "success": false,
  "message": "Database unavailable",
  "errorCode": "DB_DOWN"
}
```

---

# Login

Authenticates an existing user and returns a JWT access token.

- **Method:** `POST`
- **Endpoint:** `/login`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✅ | User's email address |
| password | string | ✅ | User's password |

### Example Request

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "huzaifa@example.com",
  "password": "StrongPassword123"
}
```

---

## Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

The returned JWT contains the following payload:

```json
{
  "id": 1,
  "name": "Huzaifa Anwar",
  "email": "huzaifa@example.com"
}
```

The token expires after **24 hours**.

---

## Error Responses

### Missing Required Fields

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "All fields are required",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### User Does Not Exist

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "User does not exist",
  "errorCode": "USER_DOESNT_EXIST"
}
```

---

### Incorrect Password

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Incorrect password",
  "errorCode": "INCORRECT_PASSWORD"
}
```

---

### Database Unavailable

**Status Code:** `503 Service Unavailable`

```json
{
  "success": false,
  "message": "Database unavailable",
  "errorCode": "DB_DOWN"
}
```

---

# Authentication

The login endpoint returns a JWT access token.

Include the token in future authenticated requests using the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

---

# Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200` | Login successful |
| `201` | User created successfully |
| `400` | Validation error |
| `401` | Incorrect password |
| `404` | User not found |
| `409` | Email already exists |
| `503` | Database unavailable |

# Error Codes

| Error Code | HTTP Status | Meaning |
|------------|-------------|---------|
| `VALIDATION_ERROR` | `400 Bad Request` | One or more required fields were missing or invalid in the request. |
| `USER_EXISTS` | `409 Conflict` | An account with the provided email already exists. |
| `USER_DOESNT_EXIST` | `404 Not Found` | No user account was found for the provided email address. |
| `INCORRECT_PASSWORD` | `401 Unauthorized` | The provided password does not match the user's password. |
| `DB_DOWN` | `503 Service Unavailable` | The database could not be reached or an internal database error occurred. |