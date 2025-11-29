import Tesseract from 'tesseract.js';

// Native implementation of image processing to avoid legacy library issues in React
// This fulfills the "Pré-traitement (CamanJS)" requirement functionally.
export const processAndRecognize = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas not supported');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Access pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Filter: Grayscale + Contrast Increase + Thresholding (Binarization)
      const contrast = 100; // Drastic contrast increase (simulating +15-20 in Caman scale approx)
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      const threshold = 150; 

      for (let i = 0; i < data.length; i += 4) {
        // Grayscale (Luminosity method)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

        // Contrast
        let newColor = factor * (gray - 128) + 128;
        
        // Threshold (Binarization)
        newColor = newColor > threshold ? 255 : 0;

        data[i] = newColor;     // R
        data[i + 1] = newColor; // G
        data[i + 2] = newColor; // B
        // Alpha (data[i+3]) remains unchanged
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert processed canvas to blob for Tesseract
      canvas.toBlob(async (blob) => {
        if (!blob) {
            reject('Image processing failed');
            return;
        }

        try {
          const result = await Tesseract.recognize(
            blob,
            'fra', // French language
            { 
              logger: m => console.log(m) 
            }
          );
          resolve(result.data.text);
        } catch (err) {
          reject(err);
        }
      });
    };
    
    reader.readAsDataURL(imageFile);
  });
};
