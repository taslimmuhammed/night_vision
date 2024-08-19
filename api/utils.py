from PIL import Image
import numpy as np
import tflite_runtime.interpreter as tflite

_interpreter = None

def load_model():
    print("Loading Model------------------")
    global _interpreter
    model_path = "model.tflite"
    _interpreter = tflite.Interpreter(model_path=model_path)
    _interpreter.allocate_tensors()
    print("Model successfully loaded")

def preprocess_image(image):
    original_shape = image.shape
    resized_img = Image.fromarray(image).resize((500, 500))
    formatted_img = np.expand_dims(np.array(resized_img), axis=0)
    return original_shape, formatted_img.astype(np.float32)

def get_prediction(image):
    global _interpreter
    if _interpreter is None:
        load_model()
    
    input_details = _interpreter.get_input_details()
    output_details = _interpreter.get_output_details()
    
    _interpreter.set_tensor(input_details[0]['index'], image)
    _interpreter.invoke()
    prediction = _interpreter.get_tensor(output_details[0]['index'])
    return prediction[0]

def post_process_image(predicted_img, original_shape):
    original_size_img = Image.fromarray(predicted_img.astype(np.uint8)).resize((original_shape[1], original_shape[0]))
    return np.array(original_size_img.convert('RGB'))

def convert_image(image):
    shape, image = preprocess_image(image)
    prediction = get_prediction(image)
    rgb_img = post_process_image(prediction, shape)
    return rgb_img

    