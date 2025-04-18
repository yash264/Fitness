# install dependencies
from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import pandas as pd
from suggestions import recommend_tasks
from flask_cors import CORS

app = Flask(__name__)


# Load model and label encoder
model = joblib.load('models/difficulty_predictor.pkl')


@app.route('/')
def home():
    return "<h1>Welcome to Server Side.</h1>"

# Classify student performance
def classify_level(prediction):
    if prediction == 1:
        return "easy"
    elif prediction == 2:
        return "medium"
    else:
        return "hard"


# route to predicting the score
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print(data)

        previous_level = int(data.get('previous_level'))
        points = int(data.get('points'))

        # Predict performance category
        prediction = model.predict(np.array([[previous_level, points]]))
        level=classify_level(prediction)

        # Get recommendation
        recommendation = recommend_tasks(level)
        print(recommendation)

        return jsonify({
            'prediction': int(prediction),
            'recommendation': recommendation,
            })
    
    except Exception as error:
        return jsonify({"error": str(error)})


if __name__ == '__main__':
    app.run(debug=True)