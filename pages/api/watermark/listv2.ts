import { getAllPdfImagesData } from "@/app/utils/pdf-lib/getAllPdfImagesData";
import { Buffer } from "buffer";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";

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
    const pdfData = await PDFDocument.load(pdfBuffer);

    res.status(200).json({
      images: await getAllPdfImagesData(pdfData)
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar el PDF",
      data: error
    });
  }
}
