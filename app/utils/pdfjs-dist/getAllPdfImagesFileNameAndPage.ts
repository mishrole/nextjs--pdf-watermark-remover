// import * as pdfjs from "pdfjs-dist/build/pdf"; // Require node >=17
import { pdfjs } from "react-pdf";
import { IPdfOPSImageData } from "../../interfaces/PdfOPSImageData";
import { IPDfOPSTransformData } from "../../interfaces/PdfOPSTransformData";
const pdfjsLib = pdfjs;

export const getAllPdfImagesFileNameAndPage = async (pdf: any) => {
  try {
    let allImages: IPdfOPSImageData[] = [];

    // Extract images from PDF pages
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      await page.getOperatorList().then(async function (opList: any) {
        let imageMatrix = {} as IPDfOPSTransformData;
        let fileName: string = "";

        for (let index = 0; index < opList.fnArray.length; index++) {
          const fn = opList.fnArray[index];
          const args = opList.argsArray[index];

          // @reference: https://github.com/TomasHubelbauer/globus/blob/main/index.mjs#L63
          switch (fn) {
            case pdfjsLib.OPS.transform: {
              imageMatrix = {
                _scaleX: args[0],
                _skewY: args[1],
                _skewX: args[2],
                _scaleY: args[3],
                transformX: args[4],
                transformY: args[5]
              };

              break;
            }

            case pdfjsLib.OPS.paintImageXObject: {
              const imageName = args[0];
              fileName = imageName;

              allImages.push({
                pageNumber,
                fileName,
                page,
                imageMatrix
              });

              break;
            }
          }
        }
      });
    }

    return allImages;
  } catch (error) {
    console.error(error);
    return [];
  }
};
