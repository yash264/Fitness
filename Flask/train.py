import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import random

# Sample dataset (real-world data should be larger )

data = []

for i in range(10000):  # 10000 synthetic records
    level = np.random.randint(1, 101)
    points = np.random.randint(level * 4, level * 10)+ np.random.randint(-10, 10)

    if level <= 10:
        difficulty = random.choices([1, 2], weights=[0.7, 0.3])[0]
    elif level <= 50:
        difficulty = random.choices([1, 2, 3], weights=[0.3, 0.5, 0.2])[0]
    else:
        difficulty = random.choices([2, 3], weights=[0.4, 0.6])[0]
    data.append([level, points, difficulty])


df = pd.DataFrame(data, columns=['previous_level', 'points', 'difficulty_level'])


# Step 3: Split data
x = df[['previous_level', 'points']]
y = df['difficulty_level']


X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)


# Step 4: Train model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)



# Step 5: Predict and Evaluate
y_pred = model.predict(X_test)


# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model Accuracy: {accuracy * 100:.2f}%\n")


# Save the trained model
joblib.dump(model, 'models/difficulty_predictor.pkl')


print("Server is running")