import { EKindImageType } from "./KindImageType";

export interface IPdfImageData {
  width: number;
  height: number;
  kind: EKindImageType;
  data: Uint8ClampedArray;
  interpolate: any;
}
