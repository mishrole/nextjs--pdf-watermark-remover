"use client";

import axios from "axios";
import React, { useState } from "react";

const PDFViewer = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<any>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setPdfFile(selectedFile);

    // if (selectedFile) {
    //   const fileReader = new FileReader();
    //   fileReader.onload = async () => {
    //     const pdfUrl = fileReader.result as string;
    //     // await getPDFInfo(pdfUrl);
    //   };
    //   fileReader.readAsDataURL(selectedFile);
    // }
  };

  // const processPDF = async () => {
  //   if (file) {
  //     const fileReader = new FileReader();

  //     fileReader.onload = async function () {
  //       const typedarray = new Uint8Array(this.result as ArrayBuffer);

  //       try {
  //         const loadingTask = getDocument(typedarray);
  //         const pdf = await loadingTask.promise;
  //         const numPages = pdf.numPages;

  //         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  //           const page = await pdf.getPage(pageNum);
  //           const textContent = await page.getTextContent();
  //           const textItems = textContent.items;

  //           const sortedTextItems = textItems.sort((a: any, b: any) => {
  //             if (a.transform[5] < b.transform[5]) {
  //               return -1;
  //             } else if (a.transform[5] > b.transform[5]) {
  //               return 1;
  //             } else {
  //               return 0;
  //             }
  //           });

  //           console.log("Texto de la página", pageNum, ":", sortedTextItems);
  //         }
  //       } catch (error) {
  //         console.error("Error al cargar el PDF:", error);
  //       }
  //     };

  //     fileReader.readAsArrayBuffer(file);
  //   }
  // };

  // const processPDF = async () => {
  //   if (file) {
  //     const fileReader = new FileReader();

  //     fileReader.onload = async function () {
  //       const typedarray = new Uint8Array(this.result as ArrayBuffer);
  //       const loadingTask = Document.load(typedarray);

  //       try {
  //         const pdf = await loadingTask.promise;
  //         const numPages = pdf.numPages;

  //         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  //           const page = await pdf.getPage(pageNum);
  //           const textContent = await page.getTextContent();
  //           const textItems = textContent.items;

  //           const sortedTextItems = textItems.sort((a: any, b: any) => {
  //             if (a.transform[5] < b.transform[5]) {
  //               return -1;
  //             } else if (a.transform[5] > b.transform[5]) {
  //               return 1;
  //             } else {
  //               return 0;
  //             }
  //           });

  //           console.log("Texto de la página", pageNum, ":", sortedTextItems);
  //         }
  //       } catch (error) {
  //         console.error("Error al cargar el PDF:", error);
  //       }
  //     };

  //     fileReader.readAsArrayBuffer(file);
  //   }
  // };

  // const processPDF = async () => {
  //   if (pdfFile) {
  //     const fileReader = new FileReader();

  //     fileReader.onload = async function () {
  //       const typedarray = new Uint8Array(this.result as ArrayBuffer);

  //       try {
  //         const loadingTask = getDocument(typedarray);
  //         const pdf = await loadingTask.promise;
  //         const numPages = pdf.numPages;

  //         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  //           const page = await pdf.getPage(pageNum);
  //           const viewport = page.getViewport({ scale: 1 });
  //           const textContent = await page.getTextContent();
  //           const textItems = textContent.items;

  //           const sortedTextItems = textItems.sort((a: any, b: any) => {
  //             const x1 = a.transform[4];
  //             const y1 = viewport.height - a.transform[5];
  //             const x2 = b.transform[4];
  //             const y2 = viewport.height - b.transform[5];

  //             if (y1 < y2) {
  //               return -1;
  //             } else if (y1 > y2) {
  //               return 1;
  //             } else if (x1 < x2) {
  //               return -1;
  //             } else if (x1 > x2) {
  //               return 1;
  //             } else {
  //               return 0;
  //             }
  //           });

  //           console.log("Texto de la página", pageNum, ":", sortedTextItems);
  //         }
  //       } catch (error) {
  //         console.error("Error al cargar el PDF:", error);
  //       }
  //     };

  //     fileReader.readAsArrayBuffer(pdfFile);
  //   }
  // };

  // const processPDF = async () => {
  //   if (pdfFile) {
  //     const fileReader = new FileReader();

  //     fileReader.onload = async function () {
  //       const typedarray = new Uint8Array(this.result as ArrayBuffer);

  //       try {
  //         const loadingTask = getDocument(typedarray);
  //         const pdf = await loadingTask.promise;
  //         const numPages = pdf.numPages;

  //         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  //           const page = await pdf.getPage(pageNum);
  //           const viewport = page.getViewport({ scale: 1 });
  //           const textContent = await page.getTextContent();
  //           const textItems = textContent.items;

  //           const sortedTextItems = textItems.sort((a: any, b: any) => {
  //             const x1 = a.transform[4];
  //             const y1 = viewport.height - a.transform[5];
  //             const x2 = b.transform[4];
  //             const y2 = viewport.height - b.transform[5];

  //             if (y1 < y2) {
  //               return -1;
  //             } else if (y1 > y2) {
  //               return 1;
  //             } else if (x1 < x2) {
  //               return -1;
  //             } else if (x1 > x2) {
  //               return 1;
  //             } else {
  //               return 0;
  //             }
  //           });

  //           console.log("Texto de la página", pageNum, ":", sortedTextItems);
  //         }
  //       } catch (error) {
  //         console.error("Error al cargar el PDF:", error);
  //       }
  //     };

  //     fileReader.readAsArrayBuffer(pdfFile);
  //   }
  // };

  // const processPDF = async () => {
  //   if (pdfFile) {
  //     const fileReader = new FileReader();

  //     fileReader.onload = async function () {
  //       const buffer = new Uint8Array(this.result as ArrayBuffer);
  //       const pdfData = await parsePdf(Buffer.from(buffer));

  //       // Obtener el contenido de texto del PDF
  //       const textContent = pdfData.text;

  //       // Dividir el contenido de texto en líneas
  //       const lines = textContent.split("\n");

  //       // Ordenar las líneas según su posición vertical
  //       const sortedLines = lines.sort((a: any, b: any) => {
  //         const positionA = parseFloat(a.split(" ")[0]);
  //         const positionB = parseFloat(b.split(" ")[0]);

  //         return positionA - positionB;
  //       });

  //       console.log("Texto ordenado:", sortedLines);
  //     };

  //     fileReader.readAsArrayBuffer(pdfFile);
  //   }
  // };

  const processPDF = async () => {
    if (pdfFile) {
      const fileReader = new FileReader();

      fileReader.onload = async function () {
        // const buffer = new Uint8Array(this.result as ArrayBuffer);
        const buffer = Buffer.from(this.result as ArrayBuffer);

        try {
          const response = await axios.post("/api/pdfParser", {
            pdfBuffer: buffer
          });
          const sortedLines = response.data.sortedLines;
          console.log("Texto ordenado:", sortedLines);
          setPdfInfo(sortedLines);
        } catch (error: any) {
          console.error("Error al procesar el PDF:", error.response);
        }
      };

      fileReader.readAsArrayBuffer(pdfFile);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        placeholder="a"
      />
      <button onClick={processPDF}>Procesar PDF</button>
      {pdfFile && (
        <div>
          <h2>{pdfFile.name}</h2>
          <p>{pdfFile.size}</p>
          <p>{pdfFile.type}</p>
          {pdfInfo && (
            <textarea
              readOnly
              placeholder="info"
              value={JSON.stringify(pdfInfo, null, 2)}
            ></textarea>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
