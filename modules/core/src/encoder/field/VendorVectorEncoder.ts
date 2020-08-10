import { Vector } from '../../model';
import { BitLength } from '../';
import { IntEncoder } from './IntEncoder';
import { BooleanEncoder } from './BooleanEncoder';
import { FixedVectorEncoder } from './FixedVectorEncoder';
import { VectorEncodingType } from './VectorEncodingType';

export class VendorVectorEncoder {

  public static decode(value: string): Vector {

    let vector: Vector;
    let index = 0;
    const maxId: number = IntEncoder.decode(value.substr(index, BitLength.maxId), BitLength.maxId);
    index += BitLength.maxId;
    const encodingType: VectorEncodingType = IntEncoder.decode(value.charAt(index), BitLength.encodingType);
    index += BitLength.encodingType;

    /**
     * Range is handled in batches so we'll need a different decoding scheme
     */
    if (encodingType === VectorEncodingType.RANGE) {

      vector = new Vector();

      const numEntries: number = IntEncoder.decode(value.substr(index, BitLength.numEntries), BitLength.numEntries);

      index += BitLength.numEntries;

      // loop through each group of entries
      for (let i = 0; i < numEntries; i++) {

        // Ranges can represent a single id or a range of ids.
        const isIdRange: boolean = BooleanEncoder.decode(value.charAt(index));

        index += BitLength.singleOrRange;

        /**
         * regardless of whether or not it's a single entry or range, the next
         * set of bits is a vendor ID
         */
        const firstId: number = IntEncoder.decode(value.substr(index, BitLength.vendorId), BitLength.vendorId);

        index += BitLength.vendorId;

        // if it's a range, the next set of bits is the second id
        if (isIdRange) {

          const secondId: number = IntEncoder.decode(value.substr(index, BitLength.vendorId), BitLength.vendorId);

          index += BitLength.vendorId;

          // we'll need to set or unset all the vendor ids between the first and second
          for (let j = firstId; j <= secondId; j++) {

            vector.set(j);

          }

        } else {

          vector.set(firstId);

        }

      }

    } else {

      const bitField = value.substr(index, maxId);

      index += maxId;
      vector = FixedVectorEncoder.decode(bitField, maxId);

    }

    vector.bitLength = index;

    return vector;

  }

}
