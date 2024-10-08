from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
import utils
app = Flask(__name__)
@app.route('/api/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.json:
        return jsonify({'error': 'No image data provided'}), 400

    image_data = request.json['image']
    
    try:
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
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
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Test endpoint working'}), 200

if __name__ == '__main__':
    utils.load_modal()
    app.run(port=5328)