# OTP API Documentation (Email OTP)

Base URL:

```
/api/otp
```

All endpoints return JSON.

---

## 1) Generate OTP

### Endpoint

```
POST /api/otp/generate
```

### Purpose

Creates a new OTP session and sends the OTP to the given email.

If a previous OTP is still pending, it will be invalidated automatically.

### Request Body

```json
{
  "email": "customer@gmail.com",
  "purpose": "LOGIN",
  "module": "AUTH",
  "ttlSeconds": 300
}
```

### Fields

| Field      | Type   | Required | Notes                                                 |
| ---------- | ------ | -------- | ----------------------------------------------------- |
| email      | string | ✅       | Must be a valid email                                 |
| purpose    | string | ✅       | Example: `LOGIN`, `RESET_PASSWORD`, `BOOKING_CONFIRM` |
| module     | string | ❌       | Optional grouping like `AUTH`, `BOOKING`              |
| ttlSeconds | number | ❌       | OTP validity in seconds (default 300)                 |

### Success Response (201)

```json
{
  "message": "OTP sent successfully",
  "data": {
    "sessionId": "66d9f5f2d8b2f0c90a12aabc",
    "expiresAt": "2026-02-18T12:40:00.000Z",
    "email": "customer@gmail.com",
    "purpose": "LOGIN",
    "module": "AUTH"
  }
}
```

### Error Responses

**400**

```json
{
  "message": "Invalid request body"
}
```

---

## 2) Validate OTP

### Endpoint

```
POST /api/otp/validate
```

### Purpose

Validates the OTP entered by the user.

### Request Body

```json
{
  "email": "customer@gmail.com",
  "purpose": "LOGIN",
  "module": "AUTH",
  "otp": "1234"
}
```

### Fields

| Field   | Type   | Required | Notes                                     |
| ------- | ------ | -------- | ----------------------------------------- |
| email   | string | ✅       | Must match the email used to generate OTP |
| purpose | string | ✅       | Must match the same purpose               |
| module  | string | ❌       | Must match if used during generation      |
| otp     | string | ✅       | Must be exactly 4 digits                  |

### Success Response (200)

```json
{
  "message": "OTP verified successfully",
  "success": true
}
```

### Error Response (400)

```json
{
  "message": "OTP validation failed",
  "reason": "INVALID_OTP"
}
```

### Possible `reason` values

| Reason            | Meaning                      |
| ----------------- | ---------------------------- |
| NO_PENDING_OTP    | No active OTP session exists |
| EXPIRED           | OTP expired                  |
| INVALID_OTP       | Wrong OTP entered            |
| TOO_MANY_ATTEMPTS | User exceeded max attempts   |

---

## 3) Resend OTP

### Endpoint

```
POST /api/otp/resend
```

### Purpose

Resends a new OTP to the email.

This endpoint has a cooldown to prevent spamming.

Cooldown:

- **30 seconds** between resend attempts

### Request Body

```json
{
  "email": "customer@gmail.com",
  "purpose": "LOGIN",
  "module": "AUTH",
  "ttlSeconds": 300
}
```

### Success Response (201)

```json
{
  "message": "OTP resent successfully",
  "data": {
    "sessionId": "66d9f5f2d8b2f0c90a12aabd",
    "expiresAt": "2026-02-18T12:45:00.000Z",
    "email": "customer@gmail.com",
    "purpose": "LOGIN",
    "module": "AUTH"
  }
}
```

### Cooldown Error (429)

```json
{
  "message": "Please wait before requesting another OTP",
  "retryAfterSeconds": 18
}
```

---

# Frontend Flow Recommendation

## Login OTP Flow

1. Call `POST /api/otp/generate`
2. Show OTP input screen
3. Call `POST /api/otp/validate`
4. If success → continue login

## Resend Flow

- If user clicks resend → call `POST /api/otp/resend`
- If API returns `429` → show countdown using `retryAfterSeconds`

---

# Notes for Frontend Dev

- OTP is always **4 digits**
- OTP expires automatically (default **5 minutes**)
- Resend cooldown is enforced server-side
- `module` is optional, but if used, it must match across generate/validate/resend
