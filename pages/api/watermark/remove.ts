// import { Buffer } from "buffer";
import { removePdfImage } from "@/app/utils/pdf-lib/removePdfImage";
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
    const imageRef = Number(req.query.imageRef);

    const result = await removePdfImage(pdfBuffer, imageRef);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${new Date()
        .toISOString()
        .replace(/:/g, "-")}_watermark_removed.pdf`
    );

    res.send(result);
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar el PDF",
      data: error
    });
  }
}
