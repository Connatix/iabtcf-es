import { TCModel } from '@iabtcf/core';
export declare class TCModelFactory {
    static noGVL(tcModel?: TCModel): TCModel;
    static addPublisherRestrictions(tcModel: TCModel): TCModel;
    static withGVL(): TCModel;
}
