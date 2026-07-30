# ⚙️ FitTrack - Production & Development Environment Run Guide

> **Target Standard**: FAANG Operational Runbook  
> **Maintainer**: Daksh Gupta  

---

## 📋 System Prerequisites

Ensure your host environment meets the following specifications:

| Runtime / Tool | Required Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v18.x` or higher | Primary API Gateway |
| **npm** | `v9.x` or higher | JavaScript package management |
| **Python** | `3.10` or higher | ML Recommender microservice |
| **MongoDB** | `v6.0+` (Local or Atlas) | Document database engine |
| **Git** | `v2.x` | Source code version control |

---

## 💻 Step-by-Step Execution Guide

### Step 1: Clone Repository
```bash
git clone https://github.com/dakshgupta-26/FIT-TRACK.git
cd FIT-TRACK
```

### Step 2: Initialize Node.js API Gateway
```bash
cd backend
npm install

# Create environment configuration file
cp .env.example .env
```
Ensure your `backend/.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fittrack
JWT_SECRET=super_secret_jwt_key_fit_track_2026
GEMINI_API_KEY=your_google_gemini_api_key
NUTRITIONIX_APP_ID=your_nutritionix_app_id
NUTRITIONIX_APP_KEY=your_nutritionix_app_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Launch the Node Gateway:
```bash
npm run dev
# Express server listening at http://localhost:5000
```

### Step 3: Initialize Python ML Microservice
Open a second terminal window:
```bash
cd python

# Create Python Virtual Environment
python -m venv venv

# Activate Virtual Environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate Virtual Environment (macOS / Linux)
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Run Flask server
python app.py
# Flask server listening at http://localhost:8000
```

### Step 4: Initialize Frontend React SPA
Open a third terminal window:
```bash
cd frontend
npm install

# Run Vite dev server
npm run dev
# Client SPA running at http://localhost:5173
```

---

## 🔍 Verification & Health Check

Execute the following HTTP requests to verify all microservices are healthy:

```bash
# Verify Node Gateway
curl http://localhost:5000/api/health

# Verify Python ML Microservice
curl -X POST http://localhost:8000/recommend -H "Content-Type: application/json" -d "{\"query\": \"chest workout\"}"
```
