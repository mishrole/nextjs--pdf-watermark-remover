import { bitmapFileHeader, dibHeader } from "./bitmap-js";

export function createBitmapBuffer({
  imageData,
  width,
  height,
  bitsPerPixel,
  colorTable = Buffer.alloc(0)
}: any): Promise<Buffer> {
  return new Promise((resolve, _) => {
    const imageDataOffset = 54 + colorTable.length;
    const filesize = imageDataOffset + imageData.length;
    let fileContent = Buffer.alloc(filesize);

    let fileHeader = bitmapFileHeader({
      filesize,
      imageDataOffset
    });

    fileHeader.copy(fileContent);

    dibHeader({
      width,
      height,
      bitsPerPixel,
      bitmapDataSize: imageData.length,
      numberOfColorsInPalette: colorTable.length / 4
    }).copy(fileContent, 14);

    colorTable.copy(fileContent, 54);

    imageData.copy(fileContent, imageDataOffset);

    resolve(fileContent);
  });
}
