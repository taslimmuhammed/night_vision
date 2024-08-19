import numpy as np
from PIL import Image
import tensorflow as tf

_model = None

def load_model():
    global _model
    model_path = 'model.tflite'  # Path to the TFLite model file
    _model = tf.lite.Interpreter(model_path=model_path)
    _model.allocate_tensors()
    print("Model successfully loaded and running")

def preprocess_image(image):
    original_shape = image.size  # PIL images use (width, height) format
    resized_img = image.resize((500, 500))  # Resize image to (500, 500)
    formatted_img = np.expand_dims(np.array(resized_img), axis=0)
    return original_shape, formatted_img

def get_prediction(image):
    global _model
    if _model is None:
        load_model()
    
    input_details = _model.get_input_details()
    output_details = _model.get_output_details()
    
    _model.set_tensor(input_details[0]['index'], image.astype(np.float32))
    _model.invoke()
    
    prediction = _model.get_tensor(output_details[0]['index'])
    predicted_img = prediction[0]
    return predicted_img

def post_process_image(predicted_img, original_shape):
    predicted_img = np.clip(predicted_img, 0, 255)  # Ensure pixel values are within valid range
    predicted_img = predicted_img.astype(np.uint8)
    
    resized_img = Image.fromarray(predicted_img)
    original_size_img = resized_img.resize(original_shape, Image.ANTIALIAS)
    
    return original_size_img

def convert_image(image):
    shape, image = preprocess_image(image)
    prediction = get_prediction(image)
    rgb_img = post_process_image(prediction, shape)
    return rgb_img
