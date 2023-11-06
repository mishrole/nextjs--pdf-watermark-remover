import { IPDfOPSTransformData } from "./PdfOPSTransformData";

export interface IPdfOPSImageData {
  pageNumber: number;
  fileName: string;
  page: any;
  imageMatrix: IPDfOPSTransformData;
}
