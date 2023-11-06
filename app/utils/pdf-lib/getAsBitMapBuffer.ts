import { padImageData } from "@/app/helpers/bitmap-js";
import { createBitmapBuffer } from "@/app/helpers/bitmap-js--custom";

export const getAsBitmapBuffer = async (
  uint8Array: Uint8Array,
  width: number,
  height: number
) => {
  try {
    // if (!buffer || buffer.length !== width * height * 3) {
    //   console.error("Invalid buffer or buffer size mismatch.");
    //   return null;
    // }

    const expectedSize = width * height * 3;

    // Verifica si el tamaño real coincide con el tamaño esperado
    if (uint8Array.length !== expectedSize) {
      throw new Error(
        `Tamaño del Uint8Array no coincide. Esperado: ${expectedSize}, Real: ${
          uint8Array.length
        }, Buffer: ${Buffer.from(uint8Array).length}`
      );
    }

    // const _data = buffer;
    const _data = uint8Array;

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
  } catch (error) {
    console.error(error);
    return null;
  }
};
