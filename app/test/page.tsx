'use client';
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

function ModelTest() {
  // State to hold the loaded model
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  // State to hold the prediction result
  const [prediction, setPrediction] = useState<number[] | null>(null);

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel('/api/tfjs/model.json');
        setModel(loadedModel);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
      }
    }
    loadModel();
  }, []);

  async function runPrediction() {
    if (model) {
      try {
        // Create a sample input tensor with correct type and shape
        const sampleInput = tf.tensor4d([Array(500 * 500 * 3).fill(0)], [1, 500, 500, 3], 'float32');
        
        // Run prediction
        const result = model.predict(sampleInput) as tf.Tensor;

        // Extract the data from the prediction tensor
        const predictionData = await result.data();
        setPrediction(Array.from(predictionData));

        // Clean up tensors to prevent memory leaks
        sampleInput.dispose();
        result.dispose();
      } catch (error) {
        console.error('Error during prediction:', error);
      }
    }
  }

  return (
    <div>
      <h1>TensorFlow.js Model Test</h1>
      {model ? (
        <div>
          <p>Model loaded successfully!</p>
          <button onClick={runPrediction}>Run Prediction</button>
          {prediction && (
            <div>
              <h2>Prediction Result:</h2>
              <pre>{JSON.stringify(prediction, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <p>Loading model...</p>
      )}
    </div>
  );
}

export default ModelTest;
