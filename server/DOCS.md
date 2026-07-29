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
  "message": "All fields are required (name, email, password)",
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
  "message": "All fields are required (email, password)",
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

# Auction Routes

Base URL:

```text
/api/v1/auctions
```

---

# Get Active Auctions

Returns all active auctions that have not yet ended.

- **Method:** `GET`
- **Endpoint:** `/`

## Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "auctions fetched",
  "data": {
    "auctions": [
      {
        "id": 1,
        "title": "Auction title",
        "description": "Auction description",
        "starting_price": 100,
        "ends_at": "2026-08-10T12:00:00.000Z",
        "status": "ACTIVE",
        "image_url": "https://...",
        "host_id": 1
      }
    ]
  }
}
```

---

# Create Auction

Creates a new auction. Requires authentication.

- **Method:** `POST`
- **Endpoint:** `/`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | Auction title |
| description | string | ✅ | Auction description |
| startingPrice | number | ✅ | Starting price, whole number |
| imageURL | string | ✅ | Auction image URL |
| endsAtDurationInHrs | number | ✅ | Auction duration in whole hours |

### Example Request

```http
POST /api/v1/auctions
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "title": "Vintage Camera",
  "description": "A collectible film camera in mint condition",
  "startingPrice": 150,
  "imageURL": "https://example.com/camera.jpg",
  "endsAtDurationInHrs": 24
}
```

## Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "message": "auction created",
  "data": {
    "auction": {
      "id": 10,
      "title": "Vintage Camera",
      "description": "A collectible film camera in mint condition",
      "starting_price": 150,
      "ends_at": "2026-08-10T12:00:00.000Z",
      "status": "ACTIVE",
      "image_url": "https://example.com/camera.jpg",
      "host_id": 1
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
  "message": "all fields are required, (title, description, startingPrice, imageURL, endsAtDurationInHrs)",
  "errorCode": "MISSING_REQUIRED_FIELDS"
}
```

---

### Invalid Title Length

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "title should be between 1-254 characters",
  "errorCode": "INVALID_TITLE_LENGTH"
}
```

---

### Invalid Description Length

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "description should be between 1-254 characters",
  "errorCode": "INVALID_DESCRIPTION_LENGTH"
}
```

---

### Invalid Starting Price

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "starting price must be a positive whole number",
  "errorCode": "INVALID_STARTING_PRICE"
}
```

---

### Invalid Duration

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "endsAtDurationInHrs must be a positive whole number",
  "errorCode": "INVALID_DURATION"
}
```

---

### Duration Too Short

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "auction must run for at least 1 hour",
  "errorCode": "DURATION_TOO_SHORT"
}
```

---

### Duration Too Long

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "auction cannot run longer than 10 days",
  "errorCode": "DURATION_TOO_LONG"
}
```

---

### Host ID Missing

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Host id wasnt found in access token paylaod, get token on api/v1/auth/login",
  "errorCode": "MISSING_HOST_ID"
}
```

---

### Database Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<database error>",
  "errorCode": "DB_ERROR"
}
```

---

# Get Auction by ID

Returns one active auction by ID. Requires authentication.

> Note: this endpoint is protected and only returns auctions that are still active.

- **Method:** `GET`
- **Endpoint:** `/:id`

### Example Request

```http
GET /api/v1/auctions/1
Authorization: Bearer <access_token>
```

## Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "auction fetched",
  "data": {
    "auction": {
      "id": 1,
      "title": "Vintage Camera",
      "description": "A collectible film camera in mint condition",
      "starting_price": 150,
      "ends_at": "2026-08-10T12:00:00.000Z",
      "status": "ACTIVE",
      "image_url": "https://example.com/camera.jpg",
      "host_id": 1
    }
  }
}
```

---

## Error Responses

### Invalid Auction ID

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "invalid auction ID",
  "errorCode": "INVALID_AUCTION_ID"
}
```

---

### Auction Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "auction does not exist",
  "errorCode": "AUCTION_NOT_FOUND"
}
```

---
### Database Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "<database error>",
  "errorCode": "DB_ERROR"
}
```

---
### Auction Ended

**Status Code:** `409 Conflict`

```json
{
  "success": false,
  "message": "auction has ended",
  "errorCode": "AUCTION_ENDED"
}
```

---

# Extend Auction Duration

Extends an existing auction's end time by a positive number of hours. Requires authentication and ownership.

- **Method:** `PATCH`
- **Endpoint:** `/:id`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| extendByHours | number | ✅ | Number of whole hours to add |

### Example Request

```http
PATCH /api/v1/auctions/1
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "extendByHours": 2
}
```

## Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "auction updated successfully",
  "data": {
    "id": 1,
    "ends_at": "2026-08-10T14:00:00.000Z"
  }
}
```

---

## Error Responses

### Invalid Field

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid field(s): <field>",
  "errorCode": "INVALID_FIELDS"
}
```

---

### Missing Extension Hours

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "extendByHours not found",
  "errorCode": "EXTENSION_HRS_MISSING"
}
```

---

### Forbidden

**Status Code:** `403 Forbidden`

```json
{
  "success": false,
  "message": "user does not have permission to update the requested auction",
  "errorCode": "FORBIDDEN"
}
```

---

### Validation Error

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "extension hours should be a positive whole number greater than 0",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### Host ID Missing

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Host id wasnt found in access token paylaod, get token on api/v1/auth/login",
  "errorCode": "MISSING_HOST_ID"
}
```

---

# Delete Auction

Deletes an existing auction by ID. Requires authentication and ownership.

- **Method:** `DELETE`
- **Endpoint:** `/:id`

### Example Request

```http
DELETE /api/v1/auctions/1
Authorization: Bearer <access_token>
```

## Success Response

**Status Code:** `204 No Content`

_No body returned._

---

## Error Responses

### Missing Auction ID

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "auction id not found",
  "errorCode": "MISSING_AUCTION_ID"
}
```

---

### Forbidden

**Status Code:** `403 Forbidden`

```json
{
  "success": false,
  "message": "user does not have permission to delete the requested auction",
  "errorCode": "FORBIDDEN"
}
```

---

# Get Auction Bids

Returns bids for a specific auction. Requires authentication.

> This endpoint is protected and returns bids only for an existing auction.

- **Method:** `GET`
- **Endpoint:** `/:id/bids`

### Example Request

```http
GET /api/v1/auctions/1/bids
Authorization: Bearer <access_token>
```

## Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "bids fetched",
  "data": {
    "auctionId": 1,
    "bids": [
      {
        "id": 5,
        "auction_id": 1,
        "amount": 200,
        "user_id": 3,
        "created_at": "2026-08-09T15:00:00.000Z"
      }
    ]
  }
}
```

---

## Error Responses

### Auction Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "auction does not exist",
  "errorCode": "AUCTION_NOT_FOUND"
}
```

---

# User Routes

Base URL:

```text
/api/v1/users
```

---

# Get Current User Profile

Returns the authenticated user's profile information.

- **Method:** `GET`
- **Endpoint:** `/me`

### Example Request

```http
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

## Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "user profile fetched",
  "data": {
    "id": 1,
    "name": "Huzaifa Anwar",
    "email": "huzaifa@example.com"
  }
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

# Auth Errors for Protected Routes

Protected endpoints require a valid bearer token in the `Authorization` header. If the token is missing, invalid, or malformed, the server may return one of these errors:

- `AUTH_HEADERS_NOT_FOUND` — `400 Bad Request`
- `TOKEN_FORMAT_ERROR` — `403 Forbidden`
- `TOKEN_NOT_FOUND` — `403 Forbidden`
- `INVALID_TOKEN` — `401 Unauthorized`

---

# Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200` | Login successful |
| `201` | User created successfully |
| `204` | No content |
| `400` | Validation error |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not found |
| `409` | Conflict |
| `500` | Server error |
| `503` | Database unavailable |

# Error Codes

| Error Code | HTTP Status | Meaning |
|------------|-------------|---------|
| `VALIDATION_ERROR` | `400 Bad Request` | One or more required fields were missing or invalid in the request. |
| `USER_EXISTS` | `409 Conflict` | An account with the provided email already exists. |
| `USER_DOESNT_EXIST` | `404 Not Found` | No user account was found for the provided email address. |
| `INCORRECT_PASSWORD` | `401 Unauthorized` | The provided password does not match the user's password. |
| `MISSING_REQUIRED_FIELDS` | `400 Bad Request` | Required fields for auction creation were missing. |
| `INVALID_TITLE_LENGTH` | `400 Bad Request` | Auction title length was invalid. |
| `INVALID_DESCRIPTION_LENGTH` | `400 Bad Request` | Auction description length was invalid. |
| `INVALID_STARTING_PRICE` | `400 Bad Request` | Auction starting price was invalid. |
| `INVALID_DURATION` | `400 Bad Request` | Auction duration was invalid. |
| `DURATION_TOO_SHORT` | `400 Bad Request` | Auction duration was shorter than the minimum allowed. |
| `DURATION_TOO_LONG` | `400 Bad Request` | Auction duration exceeded the maximum allowed. |
| `INVALID_AUCTION_ID` | `400 Bad Request` | The provided auction ID was invalid. |
| `AUCTION_NOT_FOUND` | `404 Not Found` | The requested auction could not be found. |
| `AUCTION_ENDED` | `409 Conflict` | The requested auction has already ended. |
| `INVALID_FIELDS` | `400 Bad Request` | Request contained invalid fields. |
| `EXTENSION_HRS_MISSING` | `400 Bad Request` | Auction extension hours were missing. |
| `FORBIDDEN` | `403 Forbidden` | User is not allowed to perform the requested action. |
| `MISSING_AUCTION_ID` | `400 Bad Request` | Auction ID was missing from the request. |
| `DB_ERROR` | `500 Internal Server Error` | A database error occurred. |
| `DB_DOWN` | `503 Service Unavailable` | The database could not be reached or an internal database error occurred. |
| `MISSING_HOST_ID` | `401 Unauthorized` | The token payload did not include a host/user id. |
| `AUTH_HEADERS_NOT_FOUND` | `400 Bad Request` | Authorization header was missing. |
| `TOKEN_FORMAT_ERROR` | `403 Forbidden` | Authorization header was malformed. |
| `TOKEN_NOT_FOUND` | `403 Forbidden` | Bearer token was missing from the authorization header. |
| `INVALID_TOKEN` | `401 Unauthorized` | The access token could not be verified. |