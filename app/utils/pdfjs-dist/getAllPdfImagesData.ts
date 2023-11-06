import { getAllPdfImagesFileNameAndPage } from "@/app/utils/pdfjs-dist/getAllPdfImagesFileNameAndPage";
import { getPdfImageBuffer } from "@/app/utils/pdfjs-dist/getPdfImageBuffer";
// import * as pdfjs from "pdfjs-dist/build/pdf"; // Require node >=17
import { pdfjs } from "react-pdf";

import workerSrc from "../../../pdf-worker";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

import { EKindImageType } from "../../interfaces/KindImageType";
import { IPdfImageData } from "../../interfaces/PdfImageData";

const pdfjsLib = pdfjs;

export const getAllPdfImagesData = async (pdfArrayBuffer: ArrayBuffer) => {
  try {
    const pdfData = new Uint32Array(pdfArrayBuffer);

    // Load PDF
    const pdf = await pdfjsLib.getDocument(pdfData).promise;

    let allImagesData: any[] = [];

    const allPdfImages = await getAllPdfImagesFileNameAndPage(pdf);

    for (let image of allPdfImages) {
      const { pageNumber, fileName, page, imageMatrix } = image;

      const pdfImageData: IPdfImageData = await page.objs.get(fileName);
      const imageBuffer: Buffer = await getPdfImageBuffer({
        pdfImageData,
        maxWidth: 500,
        maxHeight: 500,
        compressionFactor: 90,
        imageMatrix
      });
      const base64Image = imageBuffer.toString("base64");

      allImagesData.push({
        pageNumber,
        fileName,
        width: pdfImageData.width,
        height: pdfImageData.height,
        kind: pdfImageData.kind,
        data: base64Image,
        kindType: EKindImageType[pdfImageData.kind],
        imageMatrix
      });
    }

    return allImagesData;
  } catch (error) {
    console.error(error);
    return [];
  }
};
