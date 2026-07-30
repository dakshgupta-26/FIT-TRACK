# ⚙️ FitTrack - Internal System Mechanics & Execution Mechanics

> **Target Standard**: FAANG Engineering Internal Mechanics Spec  
> **Author**: Daksh Gupta  

---

## 1. Authentication Sequence & Session Security

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client (SPA)
    participant AuthCtx as AuthContext State
    participant Gateway as Express API Gateway
    participant Mongo as MongoDB Document Store

    User->>Client: Enters Credentials on Login Screen
    Client->>Gateway: POST /api/auth/login
    Gateway->>Mongo: Find User by Email (include +password)
    Mongo-->>Gateway: Return User Document
    Gateway->>Gateway: bcrypt.compare(password, user.password)
    alt Credentials Valid
        Gateway->>Gateway: Issue JWT Token (Expires in 30d)
        Gateway-->>Client: 200 OK + Token & User Object
        Client->>AuthCtx: Store Token in localStorage & State
        Client->>User: Redirect to Protected Dashboard Route
    else Credentials Invalid
        Gateway-->>Client: 401 Unauthorized (Invalid Email or Password)
    end
```

---

## 2. Vector Space ML Recommendation Engine Mechanics

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React SPA
    participant Express as Node API Gateway
    participant Python as Python Flask ML Service
    participant Dataset as In-Memory Pandas Dataframe

    User->>Client: Enters Query "dumbbell shoulder press"
    Client->>Express: GET /api/ai/recommend?query=dumbbell+shoulder+press
    Express->>Python: POST http://localhost:8000/recommend { query }
    Python->>Python: Extract BodyPart, Equipment & Level Keywords
    Python->>Dataset: Apply Regex Filter on Dataset Rows
    Python->>Python: Compute TF-IDF Matrix on Exercise Titles
    Python->>Python: Calculate Cosine Similarity Vector
    Python-->>Express: Return Ranked JSON Exercise List
    Express-->>Client: Forward Exercise List Payload
    Client->>User: Render Interactive Exercise Cards
```

---

## 3. Dynamic Health Metric Aggregation Engine

When a user opens the **Dashboard**, the frontend concurrently requests multiple time-series endpoints:
1. `GET /api/health-metrics/summary`: Returns latest blood pressure, resting heart rate, and sleep duration.
2. `GET /api/meals/today`: Calculates total consumed calories and macronutrients ($\text{Protein}, \text{Carbs}, \text{Fat}$).
3. `GET /api/workouts/today`: Sums active minutes and estimated caloric expenditure.

The system computes real-time Basal Metabolic Rate (BMR) using the **Mifflin-St Jeor Equation**:

$$\text{BMR}_{\text{male}} = (10 \times \text{weight}) + (6.25 \times \text{height}) - (5 \times \text{age}) + 5$$

$$\text{BMR}_{\text{female}} = (10 \times \text{weight}) + (6.25 \times \text{height}) - (5 \times \text{age}) - 161$$

Recharts uses this aggregated data to render real-time caloric balance graphs.
