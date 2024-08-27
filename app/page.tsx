"use client";
import { useState } from 'react';
import Image from 'next/image';
import styles from './NightVision.module.css';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);

  const imageUrltoBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            let str = reader.result.toString().split(",")[1]
            resolve(str);
          } else {
            reject(new Error("Failed to convert image to base64."));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to fetch image from URL: ${error}`);
    }
  };
  const base64toImage = (base64str:string)=>{
    let img = `data:image/jpeg;base64,${base64str}`
    return img
  }
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async() => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }
    let base64Image = await imageUrltoBase64(selectedImage)
    console.log(base64Image);
    
    try {
      const response = await fetch('/api/process_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransformedImage(base64toImage(data.image));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image');
    }
  };
  const downloadImage = () => {
    if (transformedImage) {
      const link = document.createElement('a');
      link.href = transformedImage;
      link.download = 'tranformed.jpg'; // The name of the downloaded image
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Night Vision</h1>
        <p className={styles.description}>Convert images to light using AI</p>

        <div className={styles.sampleImages}>
          <div className={styles.sampleImage}>
            <Image
              src="/dark-image.jpg"
              alt="Dark scene"
              width={300}
              height={200}
              className={styles.image}
            />
            <p className={styles.imageLabel}>Before</p>
          </div>
          <div className={styles.sampleImage}>
            <Image
              src="/light-image.jpg"
              alt="Light scene"
              width={300}
              height={200}
              className={styles.image}
            />
            <p className={styles.imageLabel}>After</p>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <label htmlFor="image-upload" className={styles.selectButton}>
            Select Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageChange}
          />

          {selectedImage && (
            <div className={styles.selectedImageContainer}>
              <Image
                src={selectedImage}
                alt="Selected image"
                width={300}
                height={200}
                className={styles.image}
              />
              <button onClick={handleTransform} className={styles.transformButton}>
                Transform
              </button>
            </div>
          )}

          {transformedImage && (
            <div className={styles.transformedImageContainer}>
              <h2 className={styles.subheading}>Transformed Image</h2>
              <Image
                src={transformedImage}
                alt="Transformed image"
                width={300}
                height={200}
                className={styles.image}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}