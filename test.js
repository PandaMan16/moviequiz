// import * as Tesseract from 'tesseract.js';
// import * as Tesseract from "./node_modules/tesseract.js/src/tesseract.js";

document.querySelectorAll('img').forEach(element => {
  Tesseract.recognize(element)
  .then(result => {
    // Récupérer les régions de texte détectées
    const textRegions = result.data.words;

    // Créer un canvas temporaire pour le flou
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

    // Appliquer le flou aux régions de texte détectées
    textRegions.forEach(region => {
      const { left, top, width, height } = region.bbox;
      tempContext.filter = 'blur(10px)';
      tempContext.fillRect(left, top, width, height);
    });

    // Afficher l'image floutée
    const finalCanvas = document.createElement('canvas');
    const finalContext = finalCanvas.getContext('2d');
    finalCanvas.width = image.width;
    finalCanvas.height = image.height;
    finalContext.drawImage(tempCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
    document.body.appendChild(finalCanvas);
  })
  .catch(error => {
    console.error('Erreur lors de la détection du texte :', error);
  });
});