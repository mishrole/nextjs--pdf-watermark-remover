import { IPdfImageData } from "./PdfImageData";
import { IPDfOPSTransformData } from "./PdfOPSTransformData";

export interface IPdfImageBuffer {
  pdfImageData: IPdfImageData;
  maxWidth: number;
  maxHeight: number;
  compressionFactor: number;
  imageMatrix: IPDfOPSTransformData;
}
