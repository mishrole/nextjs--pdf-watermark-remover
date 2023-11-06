import { IPdfLibPureImageData } from "@/app/interfaces/PdfLibPureImageData";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";

// Reference: https://github.com/Hopding/pdf-lib/issues/83#issuecomment-1274786806
export const getPureImagesDataFromPdf = async (pdfData: PDFDocument) => {
  try {
    const enumeratedIndirectObjects =
      pdfData.context.enumerateIndirectObjects();

    const imagesInPDF: IPdfLibPureImageData[] = [];

    let objectIdx = 0;

    enumeratedIndirectObjects.forEach(([pdfRef, pdfObject], index) => {
      objectIdx += 1;

      if (!(pdfObject instanceof PDFRawStream)) return;

      const { dict, contents } = pdfObject;

      const ref = pdfRef.objectNumber;
      const smaskRef = dict.get(PDFName.of("SMask"));
      const colorSpace = dict.get(PDFName.of("ColorSpace"));
      const subtype = dict.get(PDFName.of("Subtype"));
      const width = dict.get(PDFName.of("Width"));
      const height = dict.get(PDFName.of("Height"));
      const name = dict.get(PDFName.of("Name"));
      const bitsPerComponent = dict.get(PDFName.of("BitsPerComponent"));
      const filter = dict.get(PDFName.of("Filter"));

      if (subtype == PDFName.of("Image")) {
        // dumpSync(
        //   JSON.stringify(
        //     {
        //       ref,
        //       smaskRef,
        //       data: contents
        //     },
        //     null,
        //     2
        //   ),
        //   "json"
        // );
        const type = filter === PDFName.of("DCTDecode") ? "jpeg" : "png";

        // const alphaLayerReference = enumeratedIndirectObjects.find(
        //   ([ref]) => ref === smaskRef
        // );

        // let alphaLayerContents = null;

        // let alphaLayerDict;

        // // let alphaLayer = null

        // if (
        //   alphaLayerReference &&
        //   alphaLayerReference[1] instanceof PDFRawStream
        // ) {
        //   alphaLayerDict = alphaLayerReference[1].dict;
        //   alphaLayerContents = alphaLayerReference[1].contents;
        // }

        // Get dict of alpha layer
        // const alphaLayerDict = alphaLayerReference

        // const alphaLayer =
        //   type === "png" && alphaLayerContents && alphaLayerContents?.length > 0
        //     ? {
        //         ref: smaskRef,
        //         data: alphaLayerContents,
        //         colorSpace: alphaLayerDict?.get(PDFName.of("ColorSpace")),
        //         name: alphaLayerDict?.get(PDFName.of("Name")),
        //         width: Number(
        //           alphaLayerDict?.get(PDFName.of("Width"))?.toString()
        //         ),
        //         height: Number(
        //           alphaLayerDict?.get(PDFName.of("Height"))?.toString()
        //         ),
        //         bitsPerComponent: Number(
        //           alphaLayerDict
        //             ?.get(PDFName.of("BitsPerComponent"))
        //             ?.toString()
        //         ),
        //         type:
        //           alphaLayerDict?.get(PDFName.of("Filter")) ===
        //           PDFName.of("DCTDecode")
        //             ? "jpeg"
        //             : "png",
        //         isAlphaLayer: true
        //       }
        //     : null;

        let image: any = {
          index: index,
          ref,
          data: contents,
          smaskRef,
          colorSpace,
          name: name,
          width: Number(width?.toString()),
          height: Number(height?.toString()),
          bitsPerComponent: Number(bitsPerComponent?.toString()),
          type: type,
          needsAlphaLayer: type === "png" && smaskRef !== undefined,
          isAlphaLayer: false
        };

        if (type === "png" && smaskRef !== undefined) {
          image = {
            ...image,
            alphaLayer: image
          };
        }

        imagesInPDF.push(image);
      }
    });

    // imagesInPDF.forEach((image) => {
    //   if (image.type === "png" && image.smaskRef) {
    //     const smaskImg = imagesInPDF.find(({ ref }) => {
    //       return ref === image.smaskRef;
    //     });

    //     if (smaskImg) {
    //       console.log(image.ref, image.smaskRef);
    //       smaskImg.isAlphaLayer = true;

    //       image.alphaLayer = image;
    //     }
    //   }
    // });

    return imagesInPDF;
  } catch (error) {
    console.error(error);
    return [];
  }
};
