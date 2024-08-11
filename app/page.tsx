'use client';
// pages/index.js
import { ChangeEventHandler, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(String);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files==null) return ;
    const file = e.target?.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string; // Assertion
        if (result==null) return;
        setSelectedImage(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    try {
      const response = await fetch('/api/process_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();

      if (response.ok) {
        setProcessedImage(data.image);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Image Processor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Image Processor</h1>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={processImage}>Process Image</button>

        {selectedImage && (
          <div>
            <h2>Selected Image:</h2>
            <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Selected" style={{ maxWidth: '100%' }} />
          </div>
        )}

        {processedImage && (
          <div>
            <h2>Processed Image:</h2>
            <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        input, button {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}