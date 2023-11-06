"use client";

import axios from "axios";
import React, { useState } from "react";

const PDFExtractor = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<any>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setPdfFile(selectedFile);
  };

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

export default PDFExtractor;
