import pdfjsLib, { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export const getPDFInfo = async (pdfUrl: string): Promise<void> => {
  const pdf: PDFDocumentProxy = await pdfjsLib.getDocument(pdfUrl).promise;
  const page: PDFPageProxy = await pdf.getPage(1);
  const textContent: any = await page.getTextContent();

  const sortedItems = textContent.items.sort((a: any, b: any) => {
    const aTransform = a.transform;
    const bTransform = b.transform;

    if (aTransform[5] === bTransform[5]) {
      return aTransform[4] - bTransform[4];
    } else {
      return aTransform[5] - bTransform[5];
    }
  });

  let text = "";
  sortedItems.forEach((item: any) => {
    text += item.str + " ";
  });

  console.log(text);

  // Resto de la lógica aquí
};
