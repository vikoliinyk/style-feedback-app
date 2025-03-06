# app.py
import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from image_analyser import StyleAnalyser

app = Flask(__name__)
CORS(app)
print("Starting the Flask application...")

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Initialize the style analyzer
style_analyzer = StyleAnalyser()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST'])
def analyze_style():
    # Check if image exists in request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Save the file
        timestamp = int(time.time())
        filename = f"{timestamp}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Analyze with OpenAI Vision API
            analysis = style_analyzer.analyze(filepath)
            
            # Format response for frontend
            response = {
                'rating': analysis['rating'],
                'overall_style': analysis['style'],
                'fit': analysis['fit'],
                'color_analysis': analysis['color_analysis'],
                'pattern': analysis['pattern'],
                'occasions': analysis['occasions'],
                'suggestions': analysis['suggestions'],
                'dominant_colors': [color['color'] for color in analysis['dominant_colors']]
            }
            
            return jsonify(response)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working"})

if __name__ == '__main__':
    app.run(debug=True)