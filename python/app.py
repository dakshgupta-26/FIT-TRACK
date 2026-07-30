# app.py

import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ===================================================================
# 1. Initialize Flask App and Load Data
# ===================================================================

app = Flask(__name__)
# IMPORTANT: Enable CORS to allow your React app to make requests to this API
CORS(app) 

# Load the dataset from the CSV file
try:
    df = pd.read_csv('cleaned_workout_data.csv')
    df = df.fillna('')  # Fill any missing values with empty strings
except FileNotFoundError:
    print("Error: 'cleaned_workout_data.csv' not found. Make sure the file is in the same directory as app.py.")
    exit()

# ===================================================================
# 2. Recommendation Logic (The V3 Model from Colab)
# ===================================================================

# Keyword mapping for robust parsing
BODYPART_MAP = {
    'abs': 'Abdominals', 'abdominals': 'Abdominals', 'core': 'Abdominals',
    'chest': 'Chest', 'pecs': 'Chest', 'pectoral': 'Chest',
    'back': 'Back', 'lats': 'Back',
    'shoulders': 'Shoulders', 'delts': 'Shoulders',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'legs': 'Quadriceps',
    'quads': 'Quadriceps', 'quadriceps': 'Quadriceps',
    'hams': 'Hamstrings', 'hamstrings': 'Hamstrings',
    'glutes': 'Glutes',
    'calves': 'Calves'
}

EQUIPMENT_MAP = {
    'dumbbell': 'Dumbbell', 'dumbbells': 'Dumbbell',
    'barbell': 'Barbell',
    'body': 'Body Only', 'bodyweight': 'Body Only', 'no equipment': 'Body Only',
    'bands': 'Bands', 'band': 'Bands',
    'cable': 'Cable', 'cables': 'Cable',
    'machine': 'Machine',
    'kettlebell': 'Kettlebells', 'kettlebells': 'Kettlebells'
}

LEVEL_MAP = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'expert': 'Expert', 'advanced': 'Expert'
}

def parse_query_v3(query: str):
    """Parses a user query using predefined keyword maps."""
    query_words = set(query.lower().split())
    bodyparts = {BODYPART_MAP[word] for word in query_words if word in BODYPART_MAP}
    equipment = {EQUIPMENT_MAP[word] for word in query_words if word in EQUIPMENT_MAP}
    levels = {LEVEL_MAP[word] for word in query_words if word in LEVEL_MAP}
    return bodyparts, equipment, levels

def get_recommendations_v3(user_query: str, top_n: int = 12):
    """Recommends top N workouts using a robust Filter->Rank approach."""
    bodyparts, equipment, levels = parse_query_v3(user_query)
    filtered_df = df.copy()

    if bodyparts:
        filtered_df = filtered_df[filtered_df['BodyPart'].isin(bodyparts)]
    if equipment:
        filtered_df = filtered_df[filtered_df['Equipment'].isin(equipment)]
    if levels:
        filtered_df = filtered_df[filtered_df['Level'].isin(levels)]

    if filtered_df.empty:
        return [] # Return an empty list if no matches

    title_vectorizer = TfidfVectorizer(stop_words='english')
    all_titles = filtered_df['Title'].tolist() + [user_query]
    tfidf_matrix_titles = title_vectorizer.fit_transform(all_titles)

    query_vector = tfidf_matrix_titles[-1]
    title_vectors = tfidf_matrix_titles[:-1]
    
    cosine_similarities = cosine_similarity(query_vector, title_vectors).flatten()

    num_recommendations = min(top_n, len(cosine_similarities))
    top_indices = cosine_similarities.argsort()[:-num_recommendations-1:-1]
    
    recommendations = filtered_df.iloc[top_indices]
    
    return recommendations.to_dict(orient='records')

# ===================================================================
# 3. Define API Endpoints
# ===================================================================

@app.route("/")
def index():
    return jsonify({"message": "Workout Recommender API is active!"})

@app.route("/recommend", methods=['POST'])
def recommend():
    """
    Main recommendation endpoint. Expects a JSON payload with a "query" key.
    e.g., {"query": "beginner chest workout with dumbbells"}
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Invalid request. 'query' key is missing."}), 400

    user_query = data['query']
    recommendations = get_recommendations_v3(user_query)
    
    return jsonify({"recommendations": recommendations})

# ===================================================================
# 4. Run the App
# ===================================================================

if __name__ == '__main__':
    # Runs the Flask app on localhost, port 5000
    app.run(debug=True, port=8000)