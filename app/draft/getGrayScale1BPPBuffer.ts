import { PNG } from "pngjs";
import sharp from "sharp";
import { IPdfImageBuffer } from "../interfaces/PdfImageBuffer";

export const getGrayScale1BPPBuffer = async (
  pdfImageBuffer: IPdfImageBuffer
) => {
  const { pdfImageData, maxWidth, maxHeight, compressionFactor } =
    pdfImageBuffer;
  const { width, height, data } = pdfImageData;
  const png = new PNG({ width, height });
  png.data = Buffer.from(data.buffer);

  const compressedGrayscaleImageBuffer = await sharp(png.data)
    .grayscale()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .png({ quality: compressionFactor })
    .toBuffer();

  return compressedGrayscaleImageBuffer;
};
