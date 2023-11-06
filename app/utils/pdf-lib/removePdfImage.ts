// import * as pdfjs from "pdfjs-dist/build/pdf"; // Require node >=17

import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import { dumpSync } from "../writeFile";

// const pdfjsLib = pdfjs;

const createEmptyXObject = (pdfDoc: any) =>
  pdfDoc.context.stream(new Uint8Array(0), {
    Type: "XObject",
    Subtype: "Form",
    BBox: [0, 0, 0, 0]
  });

// const findKeyForValue = (value: any, dict: any) => {
//   const entries = Array.from(dict.dict.entries());
//   const match: any = entries.find(([_key, val]: any) => val === value);
//   if (match) {
//     return match[0];
//   }
//   return undefined;
// };

export const removePdfImage = async (
  pdfArrayBuffer: ArrayBuffer,
  imageRef: number
): Promise<Buffer> => {
  try {
    const pdfData = await PDFDocument.load(pdfArrayBuffer);

    const enumeratedIndirectObjects =
      pdfData.context.enumerateIndirectObjects();

    // Find the image object
    const imageObject = enumeratedIndirectObjects.find(
      ([pdfRef, pdfObject]) => {
        if (!(pdfObject instanceof PDFRawStream)) return;

        const { dict } = pdfObject;

        const subtype = dict.get(PDFName.of("Subtype"));

        if (subtype == PDFName.of("Image")) {
          const ref = pdfRef.objectNumber;

          return ref === imageRef;
        }

        return false;
      }
    );

    if (!imageObject) {
      throw new Error("No se encontró la imagen");
    }

    // Get ref from image object
    const foundRef = imageObject[0];

    // Remove image object from pdf
    pdfData.context.delete(foundRef);

    const emptyXObject = createEmptyXObject(pdfData);

    // Assign empty xobject to image ref
    pdfData.context.assign(foundRef, emptyXObject);

    console.log("imageObject", imageObject);

    // const pages = pdfData.getPages();

    // const firstPage = pages[0];

    // let objIdx = 0;
    // const enumeratedIndirectObjects =
    //   pdfData.context.enumerateIndirectObjects();

    // enumeratedIndirectObjects.forEach((x) => {
    //   //pdfDoc.context.indirectObjects.forEach((pdfObject,ref) => {
    //   const pdfRef = x[0];
    //   const pdfObject = x[1];

    //   if (!(pdfObject instanceof PDFRawStream)) return;

    //   const { dict } = pdfObject;
    //   objIdx++;
    //   var buffer = Buffer.from(pdfObject.contents);

    //   const base64Image = buffer.toString("base64");

    //   writeFileSync(base64Image, "txt");
    // });

    // const xObjects: PDFDict | undefined = firstPage.node
    //   .Resources()
    //   ?.lookup(PDFName.of("XObject"), PDFDict);

    // // Crear un arreglo de objetos
    // let xObjectsArray = [];

    // // Verifica que xObjects no sea undefined y sea un diccionario
    // if (xObjects instanceof PDFDict) {
    //   // Itera a través de las entradas del diccionario de XObject
    //   for (const [key, value] of xObjects.entries()) {
    //     if (value instanceof PDFRef) {
    //       // Si el valor es una referencia, agrega la referencia y el nombre
    //       // Para obtener el nombre, puedes eliminar el "/" inicial del encodedName
    //       const imageName = key.toString().slice(1); // Elimina el "/" inicial
    //       // imageNames.set(imageName, value.toString()); // Almacena el nombre de la imagen y su referencia

    //       xObjectsArray.push({ name: imageName, ref: value });
    //     }
    //   }
    // } else {
    //   console.log("No se encontraron XObjects en el diccionario de recursos.");
    // }

    // console.log("xObjectsArray", xObjectsArray);

    // xObjectsArray.forEach((xObject) => {
    //   const imageRef =

    //   const image = pdfData.context.lookup(imageRef);

    //   if (image) {

    //   }
    // })

    // console.log("enumeratedIndirectObjects", enumeratedIndirectObjects);

    // Save the pdf
    const pdfBytes = await pdfData.save();

    const pdfBuffer = Buffer.from(pdfBytes);

    dumpSync(pdfBuffer, "pdf");

    return pdfBuffer;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
function getBitmapBuffer(buffer: Buffer) {
  throw new Error("Function not implemented.");
}
