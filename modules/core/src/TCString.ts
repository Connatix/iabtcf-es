import {
  Base64Url,
  BitLength,
  SegmentEncoder,
} from './encoder';

import { SegmentIDs } from './model';
import { IntEncoder } from './encoder/field/IntEncoder';
import { TCModel } from './TCModel';

/**
 * Main class for encoding and decoding a
 * TCF Transparency and Consent String
 */
export class TCString {

  /**
   * Decodes a string into a TCModel
   *
   * @param {string} encodedTCString - base64url encoded Transparency and
   * Consent String to decode - can also be a single or group of segments of
   * the string
   * @param {string} [tcModel] - model to enhance with the information.  If
   * none is passed a new instance of TCModel will be created.
   * @return {TCModel} - Returns populated TCModel
   */
  public static decode(encodedTCString: string): TCModel {

    const segments: string[] = encodedTCString.split('.');
    const len: number = segments.length;

    const tcModel = new TCModel();

    for (let i = 0; i < len; i++) {

      const segString: string = segments[i];

      /**
       * first char will contain 6 bits, we only need the first 3. In version 1
       * and 2 of the TC string there is no segment type for the CORE string.
       * Instead the first 6 bits are reserved for the encoding version, but
       * because we're only on a maximum of encoding version 2 the first 3 bits
       * in the core segment will evaluate to 0.
       */
      const firstChar: string = Base64Url.decode(segString.charAt(0));
      const segTypeBits: string = firstChar.substr(0, BitLength.segmentType);
      const segment = SegmentIDs.ID_TO_KEY[IntEncoder.decode(segTypeBits, BitLength.segmentType).toString()];

      SegmentEncoder.decode(segString, tcModel, segment);

    }

    return tcModel;

  }

}
