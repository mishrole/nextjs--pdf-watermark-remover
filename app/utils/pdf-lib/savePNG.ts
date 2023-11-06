import { IPdfLibPureImageData } from "@/app/interfaces/PdfLibPureImageData";
import pako from "pako";
import { PDFName } from "pdf-lib";
import { ColorType, PNG } from "pngjs";

const grayScaleColorType: ColorType = 0;
const rgbColorType: ColorType = 2;
const grayScaleAlphaColorType: ColorType = 4;
const rgbAlphaColorType: ColorType = 6;

const PngColorTypes = {
  Grayscale: grayScaleColorType,
  GrayscaleAlpha: grayScaleAlphaColorType,
  Rgb: rgbColorType,
  RgbAlpha: rgbAlphaColorType
};

const ComponentsPerPixelOfColorType = {
  [PngColorTypes.Grayscale]: 1,
  [PngColorTypes.GrayscaleAlpha]: 2,
  [PngColorTypes.Rgb]: 3,
  [PngColorTypes.RgbAlpha]: 4
};

const readBitAtOffsetOfByte = (byte: any, bitOffset: any) => {
  const bit = (byte >> bitOffset) & 1;
  return bit;
};

const readBitAtOffsetOfArray = (
  uint8Array: Uint8Array,
  bitOffsetWithinArray: any
) => {
  const byteOffset = Math.floor(bitOffsetWithinArray / 8);
  const byte = uint8Array[uint8Array.length - byteOffset];
  const bitOffsetWithinByte = Math.floor(bitOffsetWithinArray % 8);
  return readBitAtOffsetOfByte(byte, bitOffsetWithinByte);
};

export const savePNG = (image: IPdfLibPureImageData) => {
  return new Promise<Uint8Array>((resolve, reject) => {
    try {
      const isGrayscale = image.colorSpace === PDFName.of("DeviceGray");
      const colorPixels = pako.inflate(image.data);
      const alphaPixels = image.alphaLayer
        ? pako.inflate(image.alphaLayer.data)
        : null;

      let colorType: ColorType;

      if (isGrayscale && alphaPixels) {
        colorType = PngColorTypes.GrayscaleAlpha;
      } else if (!isGrayscale && alphaPixels) {
        colorType = PngColorTypes.RgbAlpha;
      } else if (isGrayscale) {
        colorType = PngColorTypes.Grayscale;
      } else {
        colorType = PngColorTypes.Rgb;
      }

      const colorByteSize = 1;
      const width = image.width * colorByteSize;
      const height = image.height * colorByteSize;

      const inputHasAlpha =
        colorType === PngColorTypes.RgbAlpha ||
        colorType === PngColorTypes.GrayscaleAlpha;

      let pngData = new PNG({
        width,
        height,
        colorType,
        inputColorType: colorType,
        inputHasAlpha
      });

      const componentsPerPixel = ComponentsPerPixelOfColorType[colorType];

      const newUint8Array = new Uint8Array(width * height * componentsPerPixel);
      const bufferData = Buffer.from(newUint8Array);

      pngData.data = bufferData;

      let colorPixelIdx = 0;
      let pixelIdx = 0;

      // const testAlphaChannelSize = image.width * image.height;
      // const testColorChannelSize = colorPixels.length - testAlphaChannelSize;

      // const testAlphaPixels = colorPixels.slice(testColorChannelSize);
      // const testColorPixels = colorPixels.slice(0, testColorChannelSize);

      // console.log(
      //   image.ref,
      //   colorType,
      //   "testAlphaPixels",
      //   testAlphaPixels,
      //   "testColorPixels",
      //   testColorPixels,
      //   image.isAlphaLayer
      // );

      while (pixelIdx < pngData.data.length) {
        if (colorType === PngColorTypes.Rgb) {
          pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
          pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
          pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
        } else if (colorType === PngColorTypes.RgbAlpha) {
          pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
          pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
          pngData.data[pixelIdx++] = colorPixels[colorPixelIdx++];
          // pngData.data[pixelIdx++] = alphaPixels
          //   ? alphaPixels[colorPixelIdx - 1]
          //   : 0xff;
          pngData.data[pixelIdx++] = alphaPixels?.[colorPixelIdx - 1] ?? 0xff;
        } else if (colorType === PngColorTypes.Grayscale) {
          const bit =
            readBitAtOffsetOfArray(colorPixels, colorPixelIdx++) === 0xff
              ? 0x00
              : 0xff;
          pngData.data[pngData.data.length - pixelIdx++] = bit;
        } else if (colorType === PngColorTypes.GrayscaleAlpha) {
          const bit =
            readBitAtOffsetOfArray(colorPixels, colorPixelIdx++) === 0
              ? 0x00
              : 0xff;
          pngData.data[pngData.data.length - pixelIdx++] = bit;
          // pngData.data[pngData.data.length - pixelIdx++] = alphaPixels
          //   ? alphaPixels[colorPixelIdx - 1]
          //   : 0xff;

          pngData.data[pngData.data.length - pixelIdx++] =
            alphaPixels?.[colorPixelIdx - 1] ?? 0xff;
        } else {
          throw new Error(`Unknown colorType=${colorType}`);
        }
      }

      const buffer: any[] = [];

      pngData
        .pack()
        .on("data", (data) => buffer.push(...data))
        .on("end", () => {
          const currentUint8Array = Uint8Array.from(buffer);
          // dumpSync(currentUint8Array, "png");
          return resolve(currentUint8Array);
        })
        .on("error", (err) => reject(err));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
