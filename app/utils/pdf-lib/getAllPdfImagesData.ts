import { PDFDocument } from "pdf-lib";
import { getPureImagesDataFromPdf } from "./getPureImagesDataFromPdf";
import { savePNG } from "./savePNG";

export const getAllPdfImagesData = async (pdfData: PDFDocument) => {
  const imagesInPDF = await getPureImagesDataFromPdf(pdfData);

  const result = [];

  for (let image of imagesInPDF) {
    if (!image.isAlphaLayer) {
      const imageData: Buffer =
        image.type === "jpeg" ? image.data : Buffer.from(await savePNG(image));

      const base64Image = imageData.toString("base64");

      result.push({
        ref: image.ref,
        type: image.type,
        width: image.width,
        height: image.height,
        data: base64Image,
        needsAlphaLayer: image.needsAlphaLayer
      });
    }
  }

  return result;
};
