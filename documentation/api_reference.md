# 📡 FitTrack - Enterprise REST API Reference

> **Specification Level**: FAANG Production Standard  
> **API Version**: `v1.0.0`  
> **Protocol**: HTTPS / RESTful / JSON  
> **Base URL**: `http://localhost:5000/api`  
> **Authentication**: JSON Web Token (JWT) Bearer Token (`Authorization: Bearer <token>`)

---

## 🔒 Security & Authentication Architecture

All API endpoints except `/api/auth/register` and `/api/auth/login` require stateless JWT authentication.

### Authorization Header Specification
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Standard Error Response Schema
All API errors follow a predictable standard schema:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED_ACCESS",
    "message": "Invalid or expired JWT token provided.",
    "timestamp": "2026-07-31T02:45:00.000Z"
  }
}
```

---

## 📑 Module Index

1. [Authentication Service (`/api/auth`)](#1-authentication-service-apiauth)
2. [User Management (`/api/user`)](#2-user-management-apiuser)
3. [AI & Computer Vision Gateway (`/api/ai`)](#3-ai--computer-vision-gateway-apiai)
4. [Goals & Milestone Engine (`/api/goals`)](#4-goals--milestone-engine-apigoals)
5. [Nutrition & Meal Tracking (`/api/meals`)](#5-nutrition--meal-tracking-apimeals)
6. [Workout & Exercise Management (`/api/workouts`)](#6-workout--exercise-management-apiworkouts)
7. [Physiological Metrics Engine (`/api/health-metrics`)](#7-physiological-metrics-engine-apihealth-metrics)
8. [Progress Photo & Analytics (`/api/progress`)](#8-progress-photo--analytics-apiprogress)

---

## 1. Authentication Service (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account, hashes credentials using Bcrypt (10 salt rounds), and issues a 30-day JWT.

#### Request Body
```json
{
  "firstName": "Daksh",
  "lastName": "Gupta",
  "email": "daksh@example.com",
  "password": "SecurePassword123!"
}
```

#### Response `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66a8e1f2b3c4d5e6f7a8b9c0",
      "firstName": "Daksh",
      "lastName": "Gupta",
      "email": "daksh@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `POST /api/auth/login`
Authenticates user credentials and returns a new JWT token.

#### Request Body
```json
{
  "email": "daksh@example.com",
  "password": "SecurePassword123!"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66a8e1f2b3c4d5e6f7a8b9c0",
    "email": "daksh@example.com"
  }
}
```

---

## 2. User Management (`/api/user`)

### `GET /api/user/:uid`
Fetches comprehensive user profile metrics and preferences.

#### Headers
`Authorization: Bearer <token>`

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "66a8e1f2b3c4d5e6f7a8b9c0",
    "firstName": "Daksh",
    "lastName": "Gupta",
    "email": "daksh@example.com",
    "height": 180,
    "weight": 75,
    "gender": "male",
    "language": "en",
    "profileImageUrl": "https://res.cloudinary.com/fit-track/image/upload/v1/avatars/user.jpg"
  }
}
```

---

### `PUT /api/user/profile`
Updates physical body parameters and regional app preferences.

#### Request Body
```json
{
  "height": 182,
  "weight": 74,
  "theme": "dark",
  "language": "en"
}
```

---

## 3. AI & Computer Vision Gateway (`/api/ai`)

### `POST /api/ai/chat`
Interacts with the Google Gemini 2.5 Flash Lite conversational AI coach.

#### Request Body
```json
{
  "message": "How much protein should I consume post-workout for muscle hypertrophy?"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "reply": "For optimal muscle protein synthesis (MPS), aim for 0.25–0.40g of high-quality protein per kilogram of body weight (approx 20–40g) within 1–2 hours post-workout."
}
```

---

### `POST /api/ai/scan-food`
Uploads a food plate image, performs Gemini Vision ingredient detection, queries Nutritionix API, and returns parsed nutritional breakdown.

#### Form Data Payload
`image`: Binary image file (JPEG/PNG, max 5MB)

#### Response `200 OK`
```json
{
  "success": true,
  "dishName": "Grilled Chicken Breast with Quinoa & Steamed Broccoli",
  "ingredients": ["Chicken Breast", "Quinoa", "Broccoli"],
  "nutrition": {
    "calories": 550,
    "protein": 52.5,
    "carbs": 45.0,
    "fat": 12.0
  }
}
```

---

## 4. Machine Learning Recommender Service (Python Microservice)

### `POST http://localhost:8000/recommend`
Executes TF-IDF vector space parsing and Cosine Similarity ranking over the workout database.

#### Request Body
```json
{
  "query": "intermediate dumbbell chest exercises"
}
```

#### Response `200 OK`
```json
{
  "query": "intermediate dumbbell chest exercises",
  "total_results": 4,
  "recommendations": [
    {
      "Title": "Dumbbell Bench Press",
      "BodyPart": "Chest",
      "Equipment": "Dumbbell",
      "Level": "Intermediate"
    },
    {
      "Title": "Incline Dumbbell Flyes",
      "BodyPart": "Chest",
      "Equipment": "Dumbbell",
      "Level": "Intermediate"
    }
  ]
}
```

---

## 📊 Summary Table of REST Resources

| Resource Path | Method | Auth Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | ❌ | Creates user account & returns JWT |
| `/api/auth/login` | `POST` | ❌ | Authenticates credentials & returns JWT |
| `/api/user/:uid` | `GET` | 🔐 | Fetches user metrics & settings |
| `/api/user/profile` | `PUT` | 🔐 | Updates body metrics & app configuration |
| `/api/user/profile/image` | `POST` | 🔐 | Multi-part upload for user avatar |
| `/api/ai/chat` | `POST` | 🔐 | Conversational Gemini AI assistant |
| `/api/ai/scan-food` | `POST` | 🔐 | Computer vision food scan & macro lookup |
| `/api/ai/analyze-text` | `POST` | 🔐 | NLP natural language food macro extraction |
| `/api/goals` | `GET` / `POST` | 🔐 | CRUD operations for user fitness targets |
| `/api/meals` | `GET` / `POST` | 🔐 | Log and aggregate daily dietary intake |
| `/api/workouts` | `GET` / `POST` | 🔐 | Manage custom workout routines & history |
| `/api/health-metrics` | `GET` / `POST` | 🔐 | Log physiological statistics (BP, HR, Sleep) |
| `/api/progress` | `GET` / `POST` | 🔐 | Transformation gallery and Cloudinary images |
