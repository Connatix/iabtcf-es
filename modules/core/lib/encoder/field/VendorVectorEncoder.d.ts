import { Vector } from '../../model';
export declare class VendorVectorEncoder {
    static encode(value: Vector): string;
    static decode(value: string): Vector;
    private static buildRangeEncoding;
}
