<div align="center">

  <h1>🏋️‍♂️ FitTrack</h1>
  <p><strong>An Intelligent, Enterprise-Grade AI-Powered Health & Fitness Ecosystem</strong></p>

  <p>
    FitTrack seamlessly combines microservices architecture, machine learning recommendation models, computer vision nutrition tracking, real-time spatial mapping, and interactive AI assistance to deliver a holistic wellness management platform.
  </p>

  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-documentation">API Documentation</a> •
    <a href="#-database-schema">Database Schema</a> •
    <a href="#-contributing">Contributing</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License" />
    <img src="https://img.shields.io/github/v/release/dakshgupta-26/FIT-TRACK?style=for-the-badge&color=emerald" alt="Release" />
    <img src="https://img.shields.io/github/stars/dakshgupta-26/FIT-TRACK?style=for-the-badge&color=gold" alt="Stars" />
    <img src="https://img.shields.io/github/forks/dakshgupta-26/FIT-TRACK?style=for-the-badge&color=purple" alt="Forks" />
    <img src="https://img.shields.io/github/issues/dakshgupta-26/FIT-TRACK?style=for-the-badge&color=red" alt="Issues" />
    <img src="https://img.shields.io/github/actions/workflow/status/dakshgupta-26/FIT-TRACK/ci.yml?style=for-the-badge&logo=github&label=Build" alt="Build Status" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
    <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-Learn" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
    <img src="https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify" />
  </p>

  <br />
</div>

---

## 📌 Overview

**FitTrack** (also referred to as *HealthBloom*) is a production-grade, multi-service web platform designed to bridge the gap between AI intelligence and daily health, nutrition, and fitness management. 

### 💡 What Problem Does It Solve?
Modern fitness management is fragmented across siloed applications: users use one app for workout logging, another for counting calories, a third for map navigation to local gyms, and separate streaming services for workout playlists. **FitTrack unifies this ecosystem** into a single cohesive platform powered by Machine Learning and Generative AI.

### 🎯 Core Purpose & Real-World Use Case
Whether you are a beginner seeking tailored exercise routines based on available equipment, an athlete tracking physiological metrics (resting heart rate, blood pressure, BMI), or someone managing daily dietary intake using computer vision, FitTrack acts as your personalized, automated health assistant.

> [!NOTE]
> FitTrack combines a **React 18 + TypeScript SPA frontend**, a **Node.js/Express REST API backend**, a **Python Flask Machine Learning Engine**, and **Google Gemini Generative AI** into an event-ready microservice deployment model.

---

## ✨ Features

### 🧠 1. AI-Driven Recommendation Engine & Chat Assistant
- **TF-IDF & Cosine Similarity Workout Recommendation**: Natural language queries (e.g., *"beginner chest workout with dumbbells"*) parsed via a custom keyword filter + vector space model in Python Flask.
- **Context-Aware AI Assistant**: Integrated **Gemini 2.5 Flash Lite** chatbot capable of answering fitness questions, advising on routine adjustments, and rendering markdown guidance in real-time.

### 🥗 2. Computer Vision & Smart Nutrition Tracking
- **AI Food Camera Scanner**: Upload food images to receive automated multi-item ingredient identification via **Gemini Vision**.
- **Nutritionix API Integration**: Fetches precise micro and macronutrients (calories, protein, carbs, fats).
- **Automated JSON Formatting**: Converts raw API data into clean, structured daily meal records.
- **Interactive Hydration Tracker**: Real-time water intake logging with visual progress animation.

### 📊 3. Health Analytics & Visual Progress Tracking
- **Physiological Metrics Logging**: Tracks systolic/diastolic blood pressure, resting/active heart rate, sleep breakdown (deep, light, REM), weight, and body fat percentage using **Recharts**.
- **Transformation Photo Gallery**: Upload front, side, and back body transformation photos with automated Cloudinary storage.

### 📍 4. Interactive Nearby Gym Finder
- **OpenStreetMap Overpass API**: Geolocation-aware search engine locating `fitness_centre` amenities within customizable radii.
- **React-Leaflet Mapping**: Interactive vector maps with custom markers, popups, and instant Google Maps directions.

### 🎵 5. Workout Audio & Spotify Integration
- **Spotify Web Playback SDK**: Connect Spotify accounts via OAuth 2.0 PKCE.
- **Workout-Tailored Playlists**: Filter workout tracks by intensity level (HIIT, Strength, Yoga, Cardio) and mood.

---

## 🏗️ Architecture

FitTrack implements a distributed microservices architecture consisting of three primary runtimes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               React 18 SPA                                  │
│                 (Vite + TypeScript + TailwindCSS + Shadcn)                  │
└───────────────────────┬──────────────────────────────┬──────────────────────┘
                        │                              │
                        │ HTTP / REST                  │ HTTP / REST
                        ▼                              ▼
┌──────────────────────────────────────────────┐ ┌───────────────────────────┐
│              Node.js Express API             │ │   Python Flask ML Engine  │
│             (Port 5000 / ES Modules)         │ │        (Port 8000)        │
├──────────────────────────────────────────────┤ ├───────────────────────────┤
│ • Auth (JWT + Bcrypt)                        │ │ • Pandas & Scikit-Learn   │
│ • User Profile & Settings                    │ │ • TF-IDF Vectorizer       │
│ • Health Metrics, Goals, Meals, Workouts     │ │ • Cosine Similarity Engine│
│ • Google Gemini 2.5 & Nutritionix Gateway    │ │ • Cleaned Workout Dataset │
│ • Cloudinary Storage Integration             │ └───────────────────────────┘
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                MongoDB Database              │
│       (Users, Meals, Goals, Workouts)        │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

<details open>
<summary><strong>Technology Matrix</strong></summary>

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 6, TypeScript 5, React Router DOM v6 |
| **Styling & UI** | Tailwind CSS v3, Shadcn UI, Framer Motion, Lucide Icons |
| **State & Data Fetching** | React Context (`AuthContext`), TanStack Query (React Query v5) |
| **Backend Runtime** | Node.js (ESM), Express.js v4 |
| **Machine Learning API** | Python 3, Flask, Flask-CORS, Pandas, Scikit-Learn |
| **Database & ODM** | MongoDB, Mongoose v8 |
| **Authentication** | JWT (JSON Web Tokens), Bcryptjs, Firebase Auth Client |
| **AI & NLP Models** | Google Gemini 2.5 Flash Lite (`@google/generative-ai`) |
| **External APIs** | Nutritionix Natural Nutrients API, OpenStreetMap Overpass API, Spotify Web API |
| **Cloud Storage** | Cloudinary API, Multer (Memory & Disk Storage) |
| **Maps & Data Viz** | React-Leaflet, Leaflet JS, Recharts |
| **Internationalization**| i18next, react-i18next |

</details>

---

## 📁 Folder Structure

```sh
fit-track/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary media SDK configuration
│   │   └── db.js                  # MongoDB Mongoose connection driver
│   ├── controllers/
│   │   ├── ai.controller.js       # Gemini 2.5 AI & Nutritionix orchestration
│   │   ├── auth.controller.js     # User registration & JWT authentication logic
│   │   ├── goal.controller.js     # Fitness goals & milestone management
│   │   ├── healthMetric.controller.js # Physiological metrics logging
│   │   ├── meal.controller.js     # Meal logging & macronutrient tracking
│   │   ├── progress.controller.js # Progress photo & metric controller
│   │   ├── user.controller.js     # User profile, avatars & preferences
│   │   └── workout.controller.js  # Custom workout plan management
│   ├── middleware/
│   │   ├── auth.middleware.js     # Bearer JWT verification middleware
│   │   ├── errorHandler.js        # Global Express exception handler
│   │   └── upload.middleware.js   # Multer file upload handler
│   ├── models/
│   │   ├── goal.model.js          # Mongoose schema for Fitness Goals
│   │   ├── healthMetric.model.js  # Mongoose schema for Health Metrics
│   │   ├── meal.model.js          # Mongoose schema for Meals & Macros
│   │   ├── progress.model.js      # Mongoose schema for Progress Photos
│   │   ├── user.model.js          # Mongoose schema for Users & Preferences
│   │   └── workout.model.js       # Mongoose schema for Workouts & Exercises
│   ├── routes/
│   │   ├── ai.routes.js           # Routes for AI chat, food scan & text analysis
│   │   ├── auth.routes.js         # Public auth routes (/register, /login)
│   │   ├── index.js               # Central API router aggregator (/api/*)
│   │   └── *.routes.js            # Resource routes (goals, meals, workouts)
│   ├── package.json               # Backend dependencies & ESM scripts
│   └── server.js                  # Main Node.js server entry point
├── frontend/
│   ├── public/                    # Static web assets
│   ├── src/
│   │   ├── components/            # UI components split by feature domain
│   │   │   ├── ai/                # ChatBot & recommendation UI components
│   │   │   ├── dashboard/         # Health metrics, quick actions & stats cards
│   │   │   ├── meals/             # Food database & nutrition summaries
│   │   │   ├── music/             # Spotify player & playlist management
│   │   │   ├── progress/          # Image uploader & transformation gallery
│   │   │   ├── ui/                # Shadcn primitives
│   │   │   └── workouts/          # Exercise recommenders & session timers
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Centralized authentication & user state
│   │   ├── pages/                 # Full application page views
│   │   │   ├── Dashboard.tsx      # Main user metrics dashboard
│   │   │   ├── LandingPage.tsx    # Marketing landing page
│   │   │   ├── NearbyGyms.tsx     # Interactive OpenStreetMap location view
│   │   │   └── ...                # Workouts, Meals, Metrics, Goals, Music
│   │   ├── services/
│   │   │   └── api.ts             # Axios instance configured with JWT interceptors
│   │   ├── App.tsx                # Client-side router & route protection guards
│   │   ├── index.css              # Global styles & Tailwind utilities
│   │   └── main.tsx               # React application entry point
│   ├── tailwind.config.ts         # Custom Tailwind theme tokens
│   └── vite.config.ts             # Vite bundler configuration
└── python/
    ├── app.py                     # Flask recommendation engine with TF-IDF model
    ├── cleaned_workout_data.csv   # Structured dataset for exercise similarity search
    └── requirements.txt           # Python dependency requirements
```

---

## ⚡ Getting Started

### 📋 Prerequisites
Ensure you have the following runtimes installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Python**: `3.9` or higher
- **MongoDB**: Local instance running on port `27017` or MongoDB Atlas URI

---

### 💻 Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/dakshgupta-26/FIT-TRACK.git
cd FIT-TRACK
```

2. **Setup Backend Microservice**
```bash
cd backend
npm install
```

3. **Setup Python ML Microservice**
```bash
cd ../python
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

4. **Setup Frontend SPA**
```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `PORT` | Node.js HTTP server listening port | No | `5000` |
| `MONGO_URI` | MongoDB connection string | **Yes** | `mongodb://localhost:27017/fittrack` |
| `JWT_SECRET` | Secret key for signing authorization JWTs | **Yes** | — |
| `GEMINI_API_KEY` | Google Gemini Generative AI API key | **Yes** | — |
| `NUTRITIONIX_APP_ID` | Nutritionix API App ID | **Yes** | — |
| `NUTRITIONIX_APP_KEY` | Nutritionix API App Key | **Yes** | — |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud account name | **Yes** | — |
| `CLOUDINARY_API_KEY` | Cloudinary public API key | **Yes** | — |
| `CLOUDINARY_API_SECRET` | Cloudinary private secret | **Yes** | — |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `VITE_API_URL` | Express backend base URL | No | `http://localhost:5000/api` |
| `VITE_RECOMMENDER_URL` | Python ML microservice URL | No | `http://localhost:8000` |
| `VITE_SPOTIFY_CLIENT_ID` | Spotify API Application Client ID | No | — |

---

## 🚀 Running the Project

To execute the application locally, run each component in separate terminal windows:

### 1. Run Node.js Backend API
```bash
cd backend
npm run dev
```
> Server runs at `http://localhost:5000`

### 2. Run Python ML Recommendation Service
```bash
cd python
python app.py
```
> Service runs at `http://localhost:8000`

### 3. Run Frontend React SPA
```bash
cd frontend
npm run dev
```
> Web Application opens at `http://localhost:5173`

---

## 📊 API Documentation

### Auth & User Endpoints
```http
POST /api/auth/register       # Registers a new user & returns JWT
POST /api/auth/login          # Authenticates credentials & returns JWT
GET  /api/user/:uid           # Fetches user details by UID
PUT  /api/user/profile        # Updates user profile details (Protected)
POST /api/user/profile/image  # Uploads profile image via Multer (Protected)
```

### AI & Nutrition Endpoints
```http
POST /api/ai/chat             # Interacts with Gemini 2.5 Flash Lite Chatbot
POST /api/ai/scan-food        # Computer vision analysis of food images (Protected)
POST /api/ai/analyze-text     # Natural language nutrient lookup via Nutritionix + Gemini (Protected)
```

### Python ML Endpoints
```http
POST http://localhost:8000/recommend
```
**Request Payload:**
```json
{
  "query": "beginner chest workout with dumbbells"
}
```
**Response Payload:**
```json
{
  "recommendations": [
    {
      "Title": "Dumbbell Bench Press",
      "BodyPart": "Chest",
      "Equipment": "Dumbbell",
      "Level": "Beginner"
    }
  ]
}
```

---

## 🗄️ Database Schemas

### User Schema (`User`)
- `uid`: Unique identifier matching document `_id` string.
- `email` & `password`: Unique email string and salted Bcrypt hash.
- `firstName`, `lastName`, `birthDate`, `gender`, `height`, `weight`.
- `notifications`: Embedded document managing reminder preferences.

### Goal Schema (`Goal`)
- `user`: ObjectId reference to `User`.
- `type`: Enum (`weight`, `workout`, `nutrition`, `habit`, `strength`, `hydration`, `steps`).
- `target`: Target numerical goal with associated unit string.
- `milestones`: Sub-documents tracking sub-task completion (`title`, `isCompleted`).

### Progress Schema (`Progress`)
- `user`: ObjectId reference to `User`.
- `imageUrl` & `publicId`: Secure CDN URL and public Cloudinary identifier.
- `category`: Enum (`Front`, `Back`, `Side`).

---

## 🔒 Security Practices

> [!IMPORTANT]
> FitTrack is built with standard security guidelines:
- **Stateless JWT Authorization**: Tokens expire in 30 days and are verified per request.
- **Salted Bcrypt Password Hashing**: Passwords are saved with 10 salt rounds and marked `select: false` by default in Mongoose schemas.
- **Sanitized CORS Configurations**: Origins explicitly controlled on both Express backend and Flask Python services.
- **Payload Validation**: Mongoose Schema validation prevents parameter injection.

---

## ⚡ Performance Optimizations

- **Vite ESM Bundling**: Dynamic code-splitting and rapid Module Replacement (HMR).
- **Client-Side Caching**: TanStack Query caches REST API responses to minimize redundant HTTP roundtrips.
- **Vector Space Filtering**: Python Flask recommendation algorithm pre-filters datasets before running Cosine Similarity calculations to ensure sub-100ms response times.
- **Cloud Media Delivery**: Heavy transformation photo uploads offloaded directly to Cloudinary edge nodes.

---

## 🛣️ Future Improvements

- [ ] **Native Mobile Application**: Build React Native mobile clients for iOS and Android.
- [ ] **Wearable SDK Syncing**: Direct Bluetooth/API sync for Apple Watch, Fitbit, and Garmin devices.
- [ ] **Social Leaderboards**: Opt-in social community feeds and workout challenge leaderboards.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to submit your contributions:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Daksh Gupta**
* Full Stack & AI Software Engineer
* GitHub: [@dakshgupta-26](https://github.com/dakshgupta-26)
* Project Repo: [FIT-TRACK](https://github.com/dakshgupta-26/FIT-TRACK)
