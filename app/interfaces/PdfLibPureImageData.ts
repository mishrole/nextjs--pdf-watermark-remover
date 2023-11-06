export interface IPdfLibPureImageData {
  ref: any;
  data: any;
  smaskRef: any;
  colorSpace: any;
  name: any;
  width: number;
  height: number;
  bitsPerComponent: number;
  type: string;
  needsAlphaLayer: boolean;
  isAlphaLayer: boolean;
  alphaLayer: IPdfLibPureImageData;
}
