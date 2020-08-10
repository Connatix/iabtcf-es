import {
  EncodingError,
  DecodingError,
} from '../../errors';

export class IntEncoder {

  public static decode(value: string, numBits: number): number {

    if (numBits !== value.length) {

      throw new DecodingError('invalid bit length');

    }

    return parseInt(value, 2);

  }

}
