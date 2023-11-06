import { Buffer } from "buffer";
import { PNG } from "pngjs";
import sharp from "sharp";
import { IPdfImageBuffer } from "../../interfaces/PdfImageBuffer";

import { padImageData } from "../../helpers/bitmap-js";
import { createBitmapBuffer } from "../../helpers/bitmap-js--custom";

export async function getPdfImageBuffer(pdfImageBuffer: IPdfImageBuffer) {
  if (!pdfImageBuffer) {
    throw new Error("pdfImageBuffer is required");
  }

  const {
    pdfImageData: { kind }
  } = pdfImageBuffer;

  try {
    switch (kind) {
      case 1:
        return await getBitmapBuffer(pdfImageBuffer);
      case 2:
        return await getRgb24BPPBuffer(pdfImageBuffer);
      case 3:
        return await getRgba32BPPBuffer(pdfImageBuffer);
      default:
        return await getBitmapBuffer(pdfImageBuffer);
    }
  } catch (error) {
    console.error("An error occurred while getting the image buffer", error);
    throw error;
  }
}

export const getBitmapBuffer = async (pdfImageBuffer: IPdfImageBuffer) => {
  const { pdfImageData } = pdfImageBuffer;
  const { width, height } = pdfImageData;

  const _data = pdfImageData.data;

  const data = new Uint8Array(_data.length);

  for (let y = 0; y < height; y++) {
    data.set(
      _data.slice(
        (height - y - 1) * width * 3,
        (height - y - 1) * width * 3 + width * 3
      ),
      y * width * 3
    );

    // Convert from BGR to RGB
    for (let x = 0; x < width; x++) {
      const offset = y * width * 3 + x * 3;
      const slice = data.slice(offset, offset + 3).reverse();
      data.set(slice, offset);
    }
  }

  const imageData = padImageData({
    unpaddedImageData: Buffer.from(data.buffer),
    width,
    height
  });

  // Create a bitmap file
  const bitmapBuffer = await createBitmapBuffer({
    imageData,
    width,
    height,
    bitsPerPixel: 24
  });

  return bitmapBuffer;
};

export const getRgb24BPPBuffer = async (pdfImageBuffer: IPdfImageBuffer) => {
  const buffer = await getBitmapBuffer(pdfImageBuffer);

  // TODO: Resize and compress the image from Bitmap with Sharp

  return buffer;
};

export const getRgba32BPPBuffer = async (pdfImageBuffer: IPdfImageBuffer) => {
  const { pdfImageData, maxWidth, maxHeight, compressionFactor } =
    pdfImageBuffer;
  const { width, height, data } = pdfImageData;
  const png = new PNG({ width, height });
  const imageBuffer = Buffer.from(data.buffer);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = imageBuffer[idx]; // R - Red
      png.data[idx + 1] = imageBuffer[idx + 1]; // G - Green
      png.data[idx + 2] = imageBuffer[idx + 2]; // B - Blue
      png.data[idx + 3] = imageBuffer[idx + 3]; // A - Alpha (opacity)
    }
  }

  const buffer = PNG.sync.write(png);

  const compressedPNGImageBuffer = await sharp(buffer)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .png({ quality: compressionFactor })
    .toBuffer();

  return compressedPNGImageBuffer;
};
