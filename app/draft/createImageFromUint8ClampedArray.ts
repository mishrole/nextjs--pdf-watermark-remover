import { createCanvas } from "canvas";

function createImagePNGFromUint8ClampedArray(
  data: Uint8ClampedArray,
  width: number = 250,
  height: number = 250
) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const imageData = new ImageData(data, width, height);

  context?.putImageData(imageData, 0, 0);

  const imageBuffer = canvas.toBuffer("image/png");

  return imageBuffer;
}

function createImageJPEGFromUint8ClampedArray(
  data: Uint8ClampedArray,
  width: number = 250,
  height: number = 250
) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const imageData = new ImageData(data, width, height);

  context?.putImageData(imageData, 0, 0);

  const imageBuffer = canvas.toBuffer("image/jpeg");

  return imageBuffer;
}

export {
  createImageJPEGFromUint8ClampedArray,
  createImagePNGFromUint8ClampedArray
};

// const pdfData = await pdf(pdfBuffer);
// const textContent = pdfData.text;

// Search for the watermark text in the PDF content
// const watermarkText = "Copia informativa";

// Find watermarkText even if it is in uppercase or lowercase
// const watermarkTextRegex = new RegExp(watermarkText, "i");

// Find the watermark text in the PDF content
// const watermarkTextFound = textContent.match(watermarkTextRegex);
