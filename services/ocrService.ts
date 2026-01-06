import Tesseract from 'tesseract.js';

/**
 * Traite une image (pré-traitement) et effectue une reconnaissance optique de caractères (OCR).
 * Cette fonction simule un traitement d'image natif (gris, contraste, binarisation) avant d'utiliser Tesseract.js.
 *
 * @param imageFile Le fichier image à traiter.
 * @returns Le texte extrait de l'image.
 */
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
        reject('Canvas non supporté');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Accès aux données des pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Filtre: Niveaux de gris + Augmentation du contraste + Seuillage (Binarisation)
      const contrast = 100; // Augmentation drastique du contraste
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      const threshold = 150; 

      for (let i = 0; i < data.length; i += 4) {
        // Niveaux de gris (Méthode de la luminosité)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

        // Contraste
        let newColor = factor * (gray - 128) + 128;
        
        // Seuillage (Binarisation)
        newColor = newColor > threshold ? 255 : 0;

        data[i] = newColor;     // R
        data[i + 1] = newColor; // G
        data[i + 2] = newColor; // B
        // Alpha (data[i+3]) reste inchangé
      }

      ctx.putImageData(imageData, 0, 0);

      // Conversion du canvas traité en blob pour Tesseract
      canvas.toBlob(async (blob) => {
        if (!blob) {
            reject('Échec du traitement de l\'image');
            return;
        }

        try {
          const result = await Tesseract.recognize(
            blob,
            'fra', // Langue française
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
