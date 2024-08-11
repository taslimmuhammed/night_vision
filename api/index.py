from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
import utils
app = Flask(__name__)
print("Loaading Model------------------")
@app.route('/api/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.json:
        return jsonify({'error': 'No image data provided'}), 400

    image_data = request.json['image']
    
    try:
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        
        # Read image using OpenCV
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        img = utils.convert_image(img)
        # Encode image back to base64
        _, buffer = cv2.imencode('.jpg', img)
        img_str = base64.b64encode(buffer).decode()
        
        return jsonify({
            'message': 'Image processed successfully',
            'image': img_str
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    utils.load_model()
    app.run(port=5328)

# from flask import Flask
# app = Flask(__name__)

# @app.route('/api/hello', methods=['GET'])
# def hello_world():
#     return "Hello, World!"

# if __name__ == '__main__':
#     app.run(port=5328)