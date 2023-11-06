import jpeg from "jpeg-js";
import sharp from "sharp";
import { IPdfImageBuffer } from "../interfaces/PdfImageBuffer";

export const getJpegBuffer = async (pdfImageBuffer: IPdfImageBuffer) => {
  const { pdfImageData, maxWidth, maxHeight, compressionFactor } =
    pdfImageBuffer;
  const { width, height, data } = pdfImageData;
  const rawImage = { data, width, height };
  const jpegImageData = jpeg.encode(rawImage, 90);

  const compressedJPEGImageBuffer = await sharp(jpegImageData.data)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .jpeg({ quality: compressionFactor })
    .toBuffer();

  return compressedJPEGImageBuffer;
};
