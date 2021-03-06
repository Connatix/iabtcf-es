import { BitLength } from '../BitLength';
import { BooleanEncoder } from './BooleanEncoder';
import { DecodingError } from '../../errors';
import { IntEncoder } from './IntEncoder';
import { PurposeRestrictionVector, PurposeRestriction } from '../../model';

export class PurposeRestrictionVectorEncoder {

  public static decode(encodedString: string): PurposeRestrictionVector {

    let index = 0;
    const vector: PurposeRestrictionVector = new PurposeRestrictionVector();
    const numRestrictions: number = IntEncoder.decode(encodedString.substr(index, BitLength.numRestrictions), BitLength.numRestrictions);

    index += BitLength.numRestrictions;

    for (let i = 0; i < numRestrictions; i++) {

      // First is purpose ID
      const purposeId = IntEncoder.decode(encodedString.substr(index, BitLength.purposeId), BitLength.purposeId);
      index += BitLength.purposeId;
      // Second Restriction Type
      const restrictionType = IntEncoder.decode(encodedString.substr(index, BitLength.restrictionType), BitLength.restrictionType);
      index += BitLength.restrictionType;

      const purposeRestriction: PurposeRestriction = new PurposeRestriction(purposeId, restrictionType);
      // Num Entries (number of vendors)
      const numEntries: number = IntEncoder.decode(encodedString.substr(index, BitLength.numEntries), BitLength.numEntries);
      index += BitLength.numEntries;

      for (let j = 0; j < numEntries; j++) {

        const isARange: boolean = BooleanEncoder.decode(encodedString.substr(index, BitLength.anyBoolean));
        index += BitLength.anyBoolean;

        const startOrOnlyVendorId: number = IntEncoder.decode(encodedString.substr(index, BitLength.vendorId), BitLength.vendorId);
        index += BitLength.vendorId;

        if (isARange) {

          const endVendorId: number = IntEncoder.decode(encodedString.substr(index, BitLength.vendorId), BitLength.vendorId);
          index += BitLength.vendorId;

          if (endVendorId < startOrOnlyVendorId) {

            throw new DecodingError(`Invalid RangeEntry: endVendorId ${endVendorId} is less than ${startOrOnlyVendorId}`);

          }

          for (let k: number = startOrOnlyVendorId; k <= endVendorId; k++) {

            vector.add(k, purposeRestriction);

          }

        } else {

          vector.add(startOrOnlyVendorId, purposeRestriction);

        }

      }

    }

    vector.bitLength = index;

    return vector;

  }

}
