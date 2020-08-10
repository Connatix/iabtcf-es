import { Base64Url } from './Base64Url';
import { BitLength } from './BitLength';
import { FieldEncoderMap, IntEncoder } from './field';
import { FieldSequence } from './sequence';
import { EncodingError, DecodingError } from '../errors';
import { Fields } from '../model/Fields';
import { Segment, SegmentIDs } from '../model';
import { TCModel, TCModelPropType } from '../';

export class SegmentEncoder {

  private static fieldSequence: FieldSequence = new FieldSequence();

  public static decode(encodedString: string, tcModel: TCModel, segment: string): TCModel {

    const bitField = Base64Url.decode(encodedString);
    let bStringIdx = 0;

    if (segment === Segment.CORE) {

      tcModel.version = IntEncoder.decode(bitField.substr(bStringIdx, BitLength[Fields.version]), BitLength[Fields.version]);

    }

    if (segment !== Segment.CORE) {

      bStringIdx += BitLength.segmentType;

    }

    const sequence = this.fieldSequence['' + tcModel.version][segment];

    sequence.forEach((key: string): void => {

      const encoder = FieldEncoderMap[key];
      let numBits = BitLength[key];

      if (numBits === undefined) {

        if (this.isPublisherCustom(key)) {

          /**
           * publisherCustom[Consents | LegitimateInterests] are an edge case
           * because they are of variable length. The length is defined in a
           * separate field named numCustomPurposes.
           */
          numBits = +tcModel[Fields.numCustomPurposes];

        }

      }

      if (numBits !== 0) {

        /**
         * numBits could be 0 if this is a publisher custom purposes field and
         * no custom purposes are defined. If that is the case, we don't need
         * to gather no bits and we don't need to increment our bStringIdx
         * pointer because those would all be 0 increments and would mess up
         * the next logical if statement.
         */

        const bits = bitField.substr(bStringIdx, numBits);

        tcModel[key] = encoder.decode(bits, numBits);

        if (Number.isInteger(numBits)) {

          bStringIdx += numBits;

        } else if (Number.isInteger(tcModel[key].bitLength)) {

          bStringIdx += tcModel[key].bitLength;

        } else {

          throw new DecodingError(key);

        }

      }

    });

    return tcModel;

  }

  private static isPublisherCustom(key: string): boolean {

    return key.indexOf('publisherCustom') === 0;

  }

}
