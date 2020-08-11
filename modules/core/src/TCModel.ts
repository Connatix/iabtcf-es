import { Cloneable } from './Cloneable';
import { TCModelError } from './errors';
import { GVL } from './GVL';

import { ConsentLanguages, IntMap, PurposeRestrictionVector, Vector } from './model';
import { Purpose } from './model/gvl';

type StringOrNumber = number | string;
export type TCModelPropType = number | Date | string | boolean | Vector | PurposeRestrictionVector;

export class TCModel extends Cloneable<TCModel> {

  /**
   * Set of available consent languages published by the IAB
   */
  public static readonly consentLanguages: ConsentLanguages = GVL.consentLanguages;

  private isServiceSpecific_ = false;
  private version_ = 2;
  private consentLanguage_ = 'EN';
  private numCustomPurposes_ = 0;

  // Member Variable for GVL
  private gvl_: GVL;

  public created: Date;
  public lastUpdated: Date;

  /**
   * The TCF designates certain Features as special, that is, a CMP must afford
   * the user a means to opt in to their use. These Special Features are
   * published and numbered in the GVL separately from normal Features.
   * Provides for up to 12 special features.
   */
  public readonly specialFeatureOptins: Vector = new Vector();

  /**
   * Renamed from `PurposesAllowed` in TCF v1.1
   * The user’s consent value for each Purpose established on the legal basis
   * of consent. Purposes are published in the Global Vendor List (see. [[GVL]]).
   */
  public readonly purposeConsents: Vector = new Vector();

  /**
   * The user’s permission for each Purpose established on the legal basis of
   * legitimate interest. If the user has exercised right-to-object for a
   * purpose.
   */
  public readonly purposeLegitimateInterests: Vector = new Vector();

  /**
   * set by a publisher if they wish to collect consent and LI Transparency for
   * purposes outside of the TCF
   */
  public customPurposes: IntMap<Purpose>;

  /**
   * Each [[Vendor]] is keyed by id. Their consent value is true if it is in
   * the Vector
   */
  public readonly vendorConsents: Vector = new Vector();

  /**
   * Each [[Vendor]] is keyed by id. Whether their Legitimate Interests
   * Disclosures have been established is stored as boolean.
   * see: [[Vector]]
   */
  public readonly vendorLegitimateInterests: Vector = new Vector();

  /**
   * The value included for disclosed vendors signals which vendors have been
   * disclosed to the user in the interface surfaced by the CMP. This section
   * content is required when writing a TC string to the global (consensu)
   * scope. When a CMP has read from and is updating a TC string from the
   * global consensu.org storage, the CMP MUST retain the existing disclosure
   * information and only add information for vendors that it has disclosed
   * that had not been disclosed by other CMPs in prior interactions with this
   * device/user agent.
   */
  public readonly vendorsDisclosed: Vector = new Vector();

  /**
   * Signals which vendors the publisher permits to use OOB legal bases.
   */
  public readonly vendorsAllowed: Vector = new Vector();

  public readonly publisherRestrictions: PurposeRestrictionVector = new PurposeRestrictionVector();

  /**
   * Constructs the TCModel. Passing a [[GVL]] is optional when constructing
   * as this TCModel may be constructed from decoding an existing encoded
   * TCString.
   *
   * @param {GVL} [gvl]
   */
  public constructor(gvl?: GVL) {

    super();

    if (gvl) {

      this.gvl = gvl;

    }

    this.created = new Date();
    this.updated();

  }

  /**
   * sets the [[GVL]] with side effects of also setting the `vendorListVersion`, `policyVersion`, and `consentLanguage`
   * @param {GVL} gvl
   */
  public set gvl(gvl: GVL) {

    /**
     * set the reference, but make sure it's our GVL wrapper class.
     */

    if (!(GVL.isInstanceOf(gvl))) {

      gvl = new GVL(gvl);

    }

    this.gvl_ = gvl;
    this.publisherRestrictions.gvl = gvl;

  }

  /**
   * @return {GVL} the gvl instance set on this TCModel instance
   */
  public get gvl(): GVL {

    return this.gvl_;

  }

  /**
   * @param {string} lang - [two-letter ISO 639-1 language
   * code](http://www.loc.gov/standards/iso639-2/php/code_list.php) in which
   * the CMP UI was presented
   *
   * @throws {TCModelError} if the value is not a length-2 string of alpha characters
   */
  public set consentLanguage(lang: string) {

    this.consentLanguage_ = lang;

  }

  public get consentLanguage(): string {

    return this.consentLanguage_;

  }

  public set version(num: StringOrNumber) {

    this.version_ = parseInt(num as string, 10);

  }
  public get version(): StringOrNumber {

    return this.version_;

  }

  /**
   * Whether the signals encoded in this TC String were from site-specific
   * storage `true` versus ‘global’ consensu.org shared storage `false`. A
   * string intended to be stored in global/shared scope but the CMP is unable
   * to store due to a user agent not accepting third-party cookies would be
   * considered site-specific `true`.
   *
   * @param {boolean} bool - value to set. Some changes to other fields in this
   * model will automatically change this value like adding publisher
   * restrictions.
   */
  public set isServiceSpecific(bool: boolean) {

    this.isServiceSpecific_ = bool;

  };
  public get isServiceSpecific(): boolean {

    return this.isServiceSpecific_;

  };

  /**
     * setAllVendorConsents - sets all vendors on the GVL Consent (true)
     *
     * @return {void}
     */
  public setAllVendorConsents(): void {

    this.vendorConsents.set(this.gvl.vendors);

  }

  /**
   * unsetAllVendorConsents - unsets all vendors on the GVL Consent (false)
   *
   * @return {void}
   */
  public unsetAllVendorConsents(): void {

    this.vendorConsents.empty();

  }

  /**
   * setAllVendorLegitimateInterests - sets all vendors on the GVL LegitimateInterests (true)
   *
   * @return {void}
   */
  public setAllVendorLegitimateInterests(): void {

    this.vendorLegitimateInterests.set(this.gvl.vendors);

  }

  /**
   * unsetAllVendorLegitimateInterests - unsets all vendors on the GVL LegitimateInterests (false)
   *
   * @return {void}
   */
  public unsetAllVendorLegitimateInterests(): void {

    this.vendorLegitimateInterests.empty();

  }

  /**
   * setAllPurposeConsents - sets all purposes on the GVL Consent (true)
   *
   * @return {void}
   */
  public setAllPurposeConsents(): void {

    this.purposeConsents.set(this.gvl.purposes);

  }

  /**
   * unsetAllPurposeConsents - unsets all purposes on the GVL Consent (false)
   *
   * @return {void}
   */
  public unsetAllPurposeConsents(): void {

    this.purposeConsents.empty();

  }

  /**
   * setAllPurposeLegitimateInterests - sets all purposes on the GVL LI Transparency (true)
   *
   * @return {void}
   */
  public setAllPurposeLegitimateInterests(): void {

    this.purposeLegitimateInterests.set(this.gvl.purposes);

  }

  /**
   * unsetAllPurposeLegitimateInterests - unsets all purposes on the GVL LI Transparency (false)
   *
   * @return {void}
   */
  public unsetAllPurposeLegitimateInterests(): void {

    this.purposeLegitimateInterests.empty();

  }

  /**
   * setAllSpecialFeatureOptins - sets all special featuresOptins on the GVL (true)
   *
   * @return {void}
   */
  public setAllSpecialFeatureOptins(): void {

    this.specialFeatureOptins.set(this.gvl.specialFeatures);

  }

  /**
   * unsetAllSpecialFeatureOptins - unsets all special featuresOptins on the GVL (true)
   *
   * @return {void}
   */
  public unsetAllSpecialFeatureOptins(): void {

    this.specialFeatureOptins.empty();

  }

  public setAll(): void {

    this.setAllVendorConsents();
    this.setAllPurposeLegitimateInterests();
    this.setAllSpecialFeatureOptins();
    this.setAllPurposeConsents();
    this.setAllVendorLegitimateInterests();

  }

  public unsetAll(): void {

    this.unsetAllVendorConsents();
    this.unsetAllPurposeLegitimateInterests();
    this.unsetAllSpecialFeatureOptins();
    this.unsetAllPurposeConsents();
    this.unsetAllVendorLegitimateInterests();

  }

  public get numCustomPurposes(): StringOrNumber {

    let len = this.numCustomPurposes_;

    if (typeof this.customPurposes === 'object') {

      /**
       * Keys are not guaranteed to be in order and likewise there is no
       * requirement that the customPurposes be non-sparse.  So we have to sort
       * and take the highest value.  Even if the set only contains 3 purposes
       * but goes to ID 6 we need to set the number to 6 for the encoding to
       * work properly since it's positional.
       */
      const purposeIds: string[] = Object.keys(this.customPurposes)
        .sort((a: string, b: string): number => +a - +b);

      len = parseInt(purposeIds.pop(), 10);

    }

    return len;

  }

  public set numCustomPurposes(num: StringOrNumber) {

    this.numCustomPurposes_ = parseInt(num as string, 10);

    if (this.numCustomPurposes_ < 0) {

      throw new TCModelError('numCustomPurposes', num);

    }

  }

  /**
   * updated - updates the lastUpdatedDate with a 'now' timestamp
   *
   * @return {void}
   */
  public updated(): void {

    this.lastUpdated = new Date();

  }

}
