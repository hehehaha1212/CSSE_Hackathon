from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Mock ML model - in production, this would be a trained model
class CarbonFootprintPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self):
        # Mock training data
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic data
        transportation = np.random.uniform(0, 50, n_samples)  # km/day
        energy_usage = np.random.uniform(5, 30, n_samples)    # kWh/day
        food_meat = np.random.uniform(0, 500, n_samples)      # grams/day
        waste = np.random.uniform(0, 5, n_samples)            # kg/day
        
        # Calculate carbon footprint (simplified formula)
        carbon_footprint = (
            transportation * 0.2 +  # Car emissions
            energy_usage * 0.5 +    # Electricity emissions
            food_meat * 0.003 +     # Meat production emissions
            waste * 0.5             # Waste emissions
        ) + np.random.normal(0, 0.5, n_samples)
        
        # Prepare features
        X = np.column_stack([transportation, energy_usage, food_meat, waste])
        y = carbon_footprint
        
        # Train model
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
    
    def predict(self, features):
        if not self.is_trained:
            self.train()
        
        features_scaled = self.scaler.transform([features])
        prediction = self.model.predict(features_scaled)[0]
        return max(0, prediction)  # Carbon footprint can't be negative

# Initialize predictor
predictor = CarbonFootprintPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ml-carbon-predictor'})

@app.route('/predict', methods=['POST'])
def predict_carbon_footprint():
    try:
        data = request.get_json()
        
        # Extract features
        transportation = float(data.get('transportation', 0))  # km/day
        energy_usage = float(data.get('energy_usage', 0))      # kWh/day
        food_meat = float(data.get('food_meat', 0))            # grams/day
        waste = float(data.get('waste', 0))                    # kg/day
        
        # Make prediction
        features = [transportation, energy_usage, food_meat, waste]
        carbon_footprint = predictor.predict(features)
        
        # Calculate breakdown
        breakdown = {
            'transportation': transportation * 0.2,
            'energy': energy_usage * 0.5,
            'food': food_meat * 0.003,
            'waste': waste * 0.5
        }
        
        return jsonify({
            'carbon_footprint': round(carbon_footprint, 2),
            'breakdown': {k: round(v, 2) for k, v in breakdown.items()},
            'unit': 'kg CO2/day'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        carbon_footprint = float(data.get('carbon_footprint', 0))
        
        # Generate personalized recommendations
        recommendations = []
        
        if carbon_footprint > 10:
            recommendations.append({
                'title': 'Reduce Transportation',
                'description': 'Consider carpooling or using public transport',
                'potential_savings': 2.5,
                'difficulty': 'medium'
            })
        
        if carbon_footprint > 8:
            recommendations.append({
                'title': 'Switch to Renewable Energy',
                'description': 'Consider solar panels or green energy plans',
                'potential_savings': 1.8,
                'difficulty': 'hard'
            })
        
        if carbon_footprint > 6:
            recommendations.append({
                'title': 'Reduce Meat Consumption',
                'description': 'Try meatless Mondays or plant-based alternatives',
                'potential_savings': 1.2,
                'difficulty': 'easy'
            })
        
        recommendations.append({
            'title': 'Reduce Waste',
            'description': 'Compost organic waste and recycle more',
            'potential_savings': 0.8,
            'difficulty': 'easy'
        })
        
        return jsonify({
            'recommendations': recommendations,
            'total_potential_savings': sum(r['potential_savings'] for r in recommendations)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/calculate', methods=['POST'])
def calculate_activity():
    try:
        data = request.get_json()
        activity_type = data.get('type')
        activity_data = data.get('data', {})
        
        # Carbon footprint calculation factors
        factors = {
            'car': 0.2,      # kg CO2 per km
            'bus': 0.05,     # kg CO2 per km
            'train': 0.04,   # kg CO2 per km
            'plane': 0.25,   # kg CO2 per km
            'meat': 0.003,   # kg CO2 per gram
            'electricity': 0.5,  # kg CO2 per kWh
            'waste': 0.5     # kg CO2 per kg
        }
        
        if activity_type not in factors:
            return jsonify({'error': 'Unknown activity type'}), 400
        
        # Calculate carbon footprint
        if activity_type == 'car':
            distance = float(activity_data.get('distance', 0))
            carbon_footprint = distance * factors[activity_type]
        elif activity_type == 'meat':
            grams = float(activity_data.get('grams', 0))
            carbon_footprint = grams * factors[activity_type]
        elif activity_type == 'electricity':
            kwh = float(activity_data.get('kwh', 0))
            carbon_footprint = kwh * factors[activity_type]
        elif activity_type == 'waste':
            kg = float(activity_data.get('kg', 0))
            carbon_footprint = kg * factors[activity_type]
        else:
            distance = float(activity_data.get('distance', 0))
            carbon_footprint = distance * factors[activity_type]
        
        return jsonify({
            'activity_type': activity_type,
            'carbon_footprint': round(carbon_footprint, 2),
            'unit': 'kg CO2'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 