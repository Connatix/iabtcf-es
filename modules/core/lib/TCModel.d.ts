import { Cloneable } from './Cloneable';
import { GVL } from './GVL';
import { ConsentLanguages, IntMap, PurposeRestrictionVector, Vector } from './model';
import { Purpose } from './model/gvl';
declare type StringOrNumber = number | string;
export declare type TCModelPropType = number | Date | string | boolean | Vector | PurposeRestrictionVector;
export declare class TCModel extends Cloneable<TCModel> {
    /**
     * Set of available consent languages published by the IAB
     */
    static readonly consentLanguages: ConsentLanguages;
    private isServiceSpecific_;
    private version_;
    private consentLanguage_;
    private numCustomPurposes_;
    private gvl_;
    created: Date;
    lastUpdated: Date;
    /**
     * The TCF designates certain Features as special, that is, a CMP must afford
     * the user a means to opt in to their use. These Special Features are
     * published and numbered in the GVL separately from normal Features.
     * Provides for up to 12 special features.
     */
    readonly specialFeatureOptins: Vector;
    /**
     * Renamed from `PurposesAllowed` in TCF v1.1
     * The user’s consent value for each Purpose established on the legal basis
     * of consent. Purposes are published in the Global Vendor List (see. [[GVL]]).
     */
    readonly purposeConsents: Vector;
    /**
     * The user’s permission for each Purpose established on the legal basis of
     * legitimate interest. If the user has exercised right-to-object for a
     * purpose.
     */
    readonly purposeLegitimateInterests: Vector;
    /**
     * set by a publisher if they wish to collect consent and LI Transparency for
     * purposes outside of the TCF
     */
    customPurposes: IntMap<Purpose>;
    /**
     * Each [[Vendor]] is keyed by id. Their consent value is true if it is in
     * the Vector
     */
    readonly vendorConsents: Vector;
    /**
     * Each [[Vendor]] is keyed by id. Whether their Legitimate Interests
     * Disclosures have been established is stored as boolean.
     * see: [[Vector]]
     */
    readonly vendorLegitimateInterests: Vector;
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
    readonly vendorsDisclosed: Vector;
    /**
     * Signals which vendors the publisher permits to use OOB legal bases.
     */
    readonly vendorsAllowed: Vector;
    readonly publisherRestrictions: PurposeRestrictionVector;
    /**
     * Constructs the TCModel. Passing a [[GVL]] is optional when constructing
     * as this TCModel may be constructed from decoding an existing encoded
     * TCString.
     *
     * @param {GVL} [gvl]
     */
    constructor(gvl?: GVL);
    /**
     * sets the [[GVL]] with side effects of also setting the `vendorListVersion`, `policyVersion`, and `consentLanguage`
     * @param {GVL} gvl
     */
    set gvl(gvl: GVL);
    /**
     * @return {GVL} the gvl instance set on this TCModel instance
     */
    get gvl(): GVL;
    /**
     * @param {string} lang - [two-letter ISO 639-1 language
     * code](http://www.loc.gov/standards/iso639-2/php/code_list.php) in which
     * the CMP UI was presented
     *
     * @throws {TCModelError} if the value is not a length-2 string of alpha characters
     */
    set consentLanguage(lang: string);
    get consentLanguage(): string;
    set version(num: StringOrNumber);
    get version(): StringOrNumber;
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
    set isServiceSpecific(bool: boolean);
    get isServiceSpecific(): boolean;
    /**
       * setAllVendorConsents - sets all vendors on the GVL Consent (true)
       *
       * @return {void}
       */
    setAllVendorConsents(): void;
    /**
     * unsetAllVendorConsents - unsets all vendors on the GVL Consent (false)
     *
     * @return {void}
     */
    unsetAllVendorConsents(): void;
    /**
     * setAllVendorLegitimateInterests - sets all vendors on the GVL LegitimateInterests (true)
     *
     * @return {void}
     */
    setAllVendorLegitimateInterests(): void;
    /**
     * unsetAllVendorLegitimateInterests - unsets all vendors on the GVL LegitimateInterests (false)
     *
     * @return {void}
     */
    unsetAllVendorLegitimateInterests(): void;
    /**
     * setAllPurposeConsents - sets all purposes on the GVL Consent (true)
     *
     * @return {void}
     */
    setAllPurposeConsents(): void;
    /**
     * unsetAllPurposeConsents - unsets all purposes on the GVL Consent (false)
     *
     * @return {void}
     */
    unsetAllPurposeConsents(): void;
    /**
     * setAllPurposeLegitimateInterests - sets all purposes on the GVL LI Transparency (true)
     *
     * @return {void}
     */
    setAllPurposeLegitimateInterests(): void;
    /**
     * unsetAllPurposeLegitimateInterests - unsets all purposes on the GVL LI Transparency (false)
     *
     * @return {void}
     */
    unsetAllPurposeLegitimateInterests(): void;
    /**
     * setAllSpecialFeatureOptins - sets all special featuresOptins on the GVL (true)
     *
     * @return {void}
     */
    setAllSpecialFeatureOptins(): void;
    /**
     * unsetAllSpecialFeatureOptins - unsets all special featuresOptins on the GVL (true)
     *
     * @return {void}
     */
    unsetAllSpecialFeatureOptins(): void;
    setAll(): void;
    unsetAll(): void;
    get numCustomPurposes(): StringOrNumber;
    set numCustomPurposes(num: StringOrNumber);
    /**
     * updated - updates the lastUpdatedDate with a 'now' timestamp
     *
     * @return {void}
     */
    updated(): void;
}
export {};
