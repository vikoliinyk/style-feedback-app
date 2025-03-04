# image_analyzer.py
import os
import base64
from openai import OpenAI
import cv2
import numpy as np

class StyleAnalyzer:
    def __init__(self, api_key=None):
        self.client = OpenAI(api_key=api_key or os.environ.get("OPENAI_API_KEY"))
    
    def _extract_dominant_colors(self, image_path, num_colors=5):
        """Extract dominant colors using K-means clustering"""
        # Read image
        img = cv2.imread(image_path)
        
        # Convert to RGB (from BGR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Reshape the image to be a list of pixels
        pixels = img_rgb.reshape(-1, 3).astype(np.float32)
        
        # Downsample for large images
        if len(pixels) > 10000:
            indices = np.random.choice(len(pixels), 10000, replace=False)
            pixels = pixels[indices]
        
        # Define criteria
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        
        # Apply K-means
        _, labels, centers = cv2.kmeans(pixels, num_colors, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
        
        # Count occurrences of each label
        counts = np.bincount(labels.flatten())
        
        # Sort colors by frequency
        colors = []
        for i in range(len(counts)):
            if i < len(centers):
                rgb = centers[i].astype(int)
                hex_color = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
                percentage = counts[i] / len(labels) * 100
                colors.append({
                    'color': hex_color,
                    'percentage': float(percentage)
                })
        
        # Sort by percentage
        return sorted(colors, key=lambda x: x['percentage'], reverse=True)[:num_colors]
    
    def _encode_image(self, image_path):
        """Encode image to base64 for API submission"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def analyze(self, image_path):
        """Analyze fashion style using OpenAI's Vision API"""
        # Extract colors locally to save on API costs
        dominant_colors = self._extract_dominant_colors(image_path)
        
        # Encode the image
        base64_image = self._encode_image(image_path)
        
        # Create the prompt for GPT-4 Vision
        prompt = """
        Analyze this outfit or clothing item and provide detailed fashion feedback.
        Focus on:
        1. Overall style category (e.g., formal, casual, business casual, streetwear)
        2. Fit and silhouette
        3. Color scheme and how the colors work together
        4. Pattern analysis (if any)
        5. Occasion suitability
        6. Rate this outfit on the scale from 1 to 5, where 1 is terrible and 5 is amazing.
        
        Format your response as JSON with the following structure:
        {
          "style": "The overall style category",
          "fit": "Description of the fit",
          "color_analysis": "Analysis of the color scheme",
          "pattern": "Description of patterns if present",
          "occasions": ["Suitable occasions"],
          "suggestions": ["2-4 specific style improvement suggestions"]
        }
        """
        
        # Call the OpenAI API
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=800,
                response_format={"type": "json_object"}
            )
            
            # Parse the result
            gpt_analysis = response.choices[0].message.content
            
            # Combine GPT analysis with our color extraction
            import json
            analysis = json.loads(gpt_analysis)
            analysis['dominant_colors'] = dominant_colors
            
            return analysis
            
        except Exception as e:
            raise Exception(f"Error analyzing image with OpenAI API: {str(e)}")