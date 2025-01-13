from flask import Flask, request, jsonify
import cv2
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

def analyze_food_image(image_data):
    # This is a placeholder for actual food recognition logic
    # You would typically use a machine learning model here
    return {
        "food": "Unknown Food",
        "allergens": [],
        "calories": 0
    }

@app.route('/scan', methods=['POST'])
def scan_food():
    try:
        # Get image data from request
        image_data = request.json['image']
        
        # Convert base64 to image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Analyze the image
        results = analyze_food_image(image)
        
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)