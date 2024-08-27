import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.initializers import glorot_uniform
from tensorflow.keras.models import model_from_json


_model = None


def load_modal():
    print("Loaading Model------------------")
    global _model
    model_path = "api/model.h5" 
    _model = tf.keras.models.load_model(model_path, custom_objects={'GlorotUniform': glorot_uniform()})
    print(_model.summary())
    print("Modal succefully running")

def convert_image(img):
    if _model==None:
        load_modal()
    original_shape = img.shape
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img,(500,500))
    img = img.reshape(1,500,500,3)
    Prediction = _model.predict(img)
    Prediction = Prediction.reshape(500,500,3)
    img[:,:,:] = Prediction[:,:,:]
    img = img.reshape(500,500,3)
    img = cv2.resize(img, (original_shape[1], original_shape[0]))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    return img

