import { Buffer } from "buffer";
import pdf from "pdf-parse";

import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.body.pdfBuffer) {
      throw new Error("pdfBuffer no es una cadena de base64 válida");
    }

    const pdfBuffer = Buffer.from(req.body.pdfBuffer);
    const pdfData = await pdf(pdfBuffer);
    const textContent = pdfData.text;
    const lines = textContent.split("\n");

    const sortedLines = lines.sort((a, b) => {
      const positionA = parseFloat(a.split(" ")[0]);
      const positionB = parseFloat(b.split(" ")[0]);

      return positionA - positionB;
    });

    const filteredLines = sortedLines.filter((line) => {
      // Remove empty lines
      if (line.trim() === "") {
        return false;
      }

      return true;
    });

    res.status(200).json({ sortedLines: filteredLines });
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar el PDF",
      data: error
    });
  }
}
