import { Cloneable } from './Cloneable';
import { GVLError } from './errors';
import { Json } from './Json';
import { ConsentLanguages, IntMap } from './model';
import { ByPurposeVendorMap, Declarations, Feature, IDSetMap, Purpose, Stack, Vendor, VendorList } from './model/gvl';

export type VersionOrVendorList = string | number | VendorList;

/**
 * class with utilities for managing the global vendor list.  Will use JSON to
 * fetch the vendor list from specified url and will serialize it into this
 * object and provide accessors.  Provides ways to group vendors on the list by
 * purpose and feature.
 */
export class GVL extends Cloneable<GVL> implements VendorList {

  private static LANGUAGE_CACHE: Map<string, Declarations> = new Map<string, VendorList>();
  private static CACHE: Map<number, Declarations> = new Map<number, Declarations>();
  private static LATEST_CACHE_KEY = 0;

  public static readonly DEFAULT_LANGUAGE: string = 'EN';

  /**
   * Set of available consent languages published by the IAB
   */
  public static readonly consentLanguages: ConsentLanguages = new ConsentLanguages();

  private static baseUrl_: string;

  /**
   * baseUrl - Entities using the vendor-list.json are required by the iab to
   * host their own copy of it to reduce the load on the iab's infrastructure
   * so a 'base' url must be set to be put together with the versioning scheme
   * of the filenames.
   *
   * @static
   * @param {string} url - the base url to load the vendor-list.json from.  This is
   * broken out from the filename because it follows a different scheme for
   * latest file vs versioned files.
   *
   * @throws {GVLError} - If the url is http[s]://vendorlist.consensu.org/...
   * this will throw an error.  IAB Europe requires that that CMPs and Vendors
   * cache their own copies of the GVL to minimize load on their
   * infrastructure.  For more information regarding caching of the
   * vendor-list.json, please see [the TCF documentation on 'Caching the Global
   * Vendor List'
   * ](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md#caching-the-global-vendor-list)
   */
  public static set baseUrl(url: string) {

    const notValid = /^https?:\/\/vendorlist\.consensu\.org\//;

    if (notValid.test(url)) {

      throw new GVLError('Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache');

    }

    // if a trailing slash was forgotten
    if (url.length > 0 && url[url.length - 1] !== '/') {

      url += '/';

    }

    this.baseUrl_ = url;

  };

  /**
   * baseUrl - Entities using the vendor-list.json are required by the iab to
   * host their own copy of it to reduce the load on the iab's infrastructure
   * so a 'base' url must be set to be put together with the versioning scheme
   * of the filenames.
   *
   * @static
   * @return {string} - returns the previously set baseUrl, the default is
   * `undefined`
   */
  public static get baseUrl(): string {

    return this.baseUrl_;

  }

  /**
   * @static
   * @param {string} - the latest is assumed to be vendor-list.json because
   * that is what the iab uses, but it could be different... if you want
   */
  public static latestFilename = 'vendor-list.json';

  /**
   * @static
   * @param {string} - the versioned name is assumed to be
   * vendor-list-v[VERSION].json where [VERSION] will be replaced with the
   * specified version.  But it could be different... if you want just make
   * sure to include the [VERSION] macro if you have a numbering scheme, it's a
   * simple string substitution.
   *
   * eg.
   * ```javascript
   * GVL.baseUrl = "http://www.mydomain.com/iabcmp/";
   * GVL.versionedFilename = "vendorlist?getVersion=[VERSION]";
   * ```
   */
  public static versionedFilename = 'archives/vendor-list-v[VERSION].json';

  /**
   * @param {Promise} resolved when this GVL object is populated with the data
   * or rejected if there is an error.
   */
  public readyPromise: Promise<void | GVLError>;

  /**
   * @param {number} gvlSpecificationVersion - schema version for the GVL that is used
   */
  public gvlSpecificationVersion: number;

  /**
   * @param {number} incremented with each published file change
   */
  public vendorListVersion: number;

  /**
   * @param {number} tcfPolicyVersion - The TCF MO will increment this value
   * whenever a GVL change (such as adding a new Purpose or Feature or a change
   * in Purpose wording) legally invalidates existing TC Strings and requires
   * CMPs to re-establish transparency and consent from users. If the policy
   * version number in the latest GVL is different from the value in your TC
   * String, then you need to re-establish transparency and consent for that
   * user. A version 1 format TC String is considered to have a version value
   * of 1.
   */
  public tcfPolicyVersion: number;

  /**
   * @param {string | Date} lastUpdated - the date in which the vendor list
   * json file  was last updated.
   */
  public lastUpdated: string | Date;

  /**
   * @param {IntMap<Purpose>} a collection of [[Purpose]]s
   */
  public purposes: IntMap<Purpose>;

  /**
   * @param {IntMap<Purpose>} a collection of [[Purpose]]s
   */
  public specialPurposes: IntMap<Purpose>;

  /**
   * @param {IntMap<Feature>} a collection of [[Feature]]s
   */
  public features: IntMap<Feature>;

  /**
   * @param {IntMap<Feature>} a collection of [[Feature]]s
   */
  public specialFeatures: IntMap<Feature>;

  /**
   * @param {boolean} internal reference of when the GVL is ready to be used
   */
  private isReady_ = false;

  /**
   * @param {IntMap<Vendor>} a collection of [[Vendor]]s
   */
  private vendors_: IntMap<Vendor>;

  public vendorIds: Set<number>;

  /**
   * @param {IntMap<Vendor>} a collection of [[Vendor]]. Used as a backup if a whitelist is sets
   */
  private fullVendorList: IntMap<Vendor>;

  /**
   * @param {ByPurposeVendorMap} vendors by purpose
   */
  private byPurposeVendorMap: ByPurposeVendorMap;

  /**
   * @param {IDSetMap} vendors by special purpose
   */
  private bySpecialPurposeVendorMap: IDSetMap;

  /**
   * @param {IDSetMap} vendors by feature
   */
  private byFeatureVendorMap: IDSetMap;

  /**
   * @param {IDSetMap} vendors by special feature
   */
  private bySpecialFeatureVendorMap: IDSetMap;

  /**
   * @param {IntMap<Stack>} a collection of [[Stack]]s
   */
  public stacks: IntMap<Stack>;

  private lang_: string;

  private isLatest = false;

  /**
   * @param {VersionOrVendorList} [versionOrVendorList] - can be either a
   * [[VendorList]] object or a version number represented as a string or
   * number to download.  If nothing is passed the latest version of the GVL
   * will be loaded
   */
  public constructor(versionOrVendorList?: VersionOrVendorList) {

    super();

    /**
     * should have been configured before and instance was created and will
     * persist through the app
     */
    let url = GVL.baseUrl;

    this.lang_ = GVL.DEFAULT_LANGUAGE;

    if (this.isVendorList(versionOrVendorList as GVL)) {

      this.populate(versionOrVendorList as Declarations);
      this.readyPromise = Promise.resolve();

    } else {

      if (!url) {

        throw new GVLError('must specify GVL.baseUrl before loading GVL json');

      }

      if (versionOrVendorList as number > 0) {

        const version = versionOrVendorList as number;

        if (GVL.CACHE.has(version)) {

          this.populate(GVL.CACHE.get(version));
          this.readyPromise = Promise.resolve();

        } else {

          // load version specified
          url += GVL.versionedFilename.replace('[VERSION]', version + '');
          this.readyPromise = this.fetchJson(url);

        }

      } else {

        /**
         * whatever it is (or isn't)... it doesn't matter we'll just get the
         * latest. In this case we may have cached the latest version at key 0.
         * If we have then we'll just use that instead of making a request.
         * Otherwise we'll have to load it (and then we'll cache it for next
         * time)
         */
        if (GVL.CACHE.has(GVL.LATEST_CACHE_KEY)) {

          this.populate(GVL.CACHE.get(GVL.LATEST_CACHE_KEY));
          this.readyPromise = Promise.resolve();

        } else {

          this.isLatest = true;
          this.readyPromise = this.fetchJson(url + GVL.latestFilename);

        }

      }

    }

  }

  private cacheLanguage(): void {

    if (!GVL.LANGUAGE_CACHE.has(this.lang_)) {

      GVL.LANGUAGE_CACHE.set(this.lang_, {
        purposes: this.purposes,
        specialPurposes: this.specialPurposes,
        features: this.features,
        specialFeatures: this.specialFeatures,
        stacks: this.stacks,
      });

    }

  }

  private async fetchJson(url: string): Promise<void | Error> {

    try {

      this.populate(await Json.fetch(url) as VendorList);

    } catch (err) {

      throw new GVLError(err.message);

    }

  }

  /**
   * getJson - Method for getting the JSON that was downloaded to created this
   * `GVL` object
   *
   * @return {VendorList} - The basic JSON structure without the extra
   * functionality and methods of this class.
   */
  public getJson(): VendorList {

    return JSON.parse(JSON.stringify({
      gvlSpecificationVersion: this.gvlSpecificationVersion,
      vendorListVersion: this.vendorListVersion,
      tcfPolicyVersion: this.tcfPolicyVersion,
      lastUpdated: this.lastUpdated,
      purposes: this.purposes,
      specialPurposes: this.specialPurposes,
      features: this.features,
      specialFeatures: this.specialFeatures,
      stacks: this.stacks,
      vendors: this.fullVendorList,
    }));

  }

  public get language(): string {

    return this.lang_;

  }

  private isVendorList(gvlObject: object): gvlObject is VendorList {

    return gvlObject !== undefined && (gvlObject as VendorList).vendors !== undefined;

  }

  private populate(gvlObject: Declarations): void {

    /**
     * these are populated regardless of whether it's a Declarations file or
     * a VendorList
     */
    this.purposes = gvlObject.purposes;
    this.specialPurposes = gvlObject.specialPurposes;
    this.features = gvlObject.features;
    this.specialFeatures = gvlObject.specialFeatures;
    this.stacks = gvlObject.stacks;

    if (this.isVendorList(gvlObject)) {

      this.gvlSpecificationVersion = gvlObject.gvlSpecificationVersion;
      this.tcfPolicyVersion = gvlObject.tcfPolicyVersion;
      this.vendorListVersion = gvlObject.vendorListVersion;
      this.lastUpdated = gvlObject.lastUpdated;

      if (typeof this.lastUpdated === 'string') {

        this.lastUpdated = new Date(this.lastUpdated);

      }

      this.vendors_ = gvlObject.vendors;
      this.fullVendorList = gvlObject.vendors;
      this.mapVendors();
      this.isReady_ = true;

      if (this.isLatest) {

        /**
         * If the "LATEST" was requested then this flag will be set to true.
         * In that case we'll cache the GVL at the special key
         */

        GVL.CACHE.set(GVL.LATEST_CACHE_KEY, this.getJson());

      }

      /**
       * Whether or not it's the "LATEST" we'll cache the gvl at the version it
       * is declared to be (if it's not already). to avoid downloading it again
       * in the future.
       */
      if (!GVL.CACHE.has(this.vendorListVersion)) {

        GVL.CACHE.set(this.vendorListVersion, this.getJson());

      }

    }

    this.cacheLanguage();

  }

  private mapVendors(vendorIds?: number[]): void {

    // create new instances of the maps
    this.byPurposeVendorMap = {};
    this.bySpecialPurposeVendorMap = {};
    this.byFeatureVendorMap = {};
    this.bySpecialFeatureVendorMap = {};

    // initializes data structure for purpose map
    Object.keys(this.purposes).forEach((purposeId: string): void => {

      this.byPurposeVendorMap[purposeId] = {
        legInt: new Set<number>(),
        consent: new Set<number>(),
        flexible: new Set<number>(),
      };

    });

    // initializes data structure for special purpose map
    Object.keys(this.specialPurposes).forEach((purposeId: string): void => {

      this.bySpecialPurposeVendorMap[purposeId] = new Set<number>();

    });

    // initializes data structure for feature map
    Object.keys(this.features).forEach((featureId: string): void => {

      this.byFeatureVendorMap[featureId] = new Set<number>();

    });

    // initializes data structure for feature map
    Object.keys(this.specialFeatures).forEach((featureId: string): void => {

      this.bySpecialFeatureVendorMap[featureId] = new Set<number>();

    });

    if (!Array.isArray(vendorIds)) {

      vendorIds = Object.keys(this.fullVendorList).map((vId: string) => +vId);

    }

    this.vendorIds = new Set(vendorIds);

    // assigns vendor ids to their respective maps
    this.vendors_ = vendorIds.reduce((vendors: {}, vendorId: number): {} => {

      const vendor: Vendor = this.vendors_['' + vendorId];

      if (vendor && vendor.deletedDate === undefined) {

        vendor.purposes.forEach((purposeId: number): void => {

          const purpGroup = this.byPurposeVendorMap[purposeId + ''];

          purpGroup.consent.add(vendorId);

        });

        vendor.specialPurposes.forEach((purposeId: number): void => {

          this.bySpecialPurposeVendorMap[purposeId + ''].add(vendorId);

        });

        vendor.legIntPurposes.forEach((purposeId: number): void => {

          this.byPurposeVendorMap[purposeId + ''].legInt.add(vendorId);

        });

        // could not be there
        if (vendor.flexiblePurposes) {

          vendor.flexiblePurposes.forEach((purposeId: number): void => {

            this.byPurposeVendorMap[purposeId + ''].flexible.add(vendorId);

          });

        }

        vendor.features.forEach((featureId: number): void => {

          this.byFeatureVendorMap[featureId + ''].add(vendorId);

        });

        vendor.specialFeatures.forEach((featureId: number): void => {

          this.bySpecialFeatureVendorMap[featureId + ''].add(vendorId);

        });

        vendors[vendorId] = vendor;

      }

      return vendors;

    }, {});

  }

  /**
   * vendors
   *
   * @return {IntMap<Vendor>} - the list of vendors as it would on the JSON file
   * except if `narrowVendorsTo` was called, it would be that narrowed list
   */
  public get vendors(): IntMap<Vendor> {

    return this.vendors_;

  }

  /**
   * narrowVendorsTo - narrows vendors represented in this GVL to the list of ids passed in
   *
   * @param {number[]} vendorIds - list of ids to narrow this GVL to
   * @return {void}
   */
  public narrowVendorsTo(vendorIds: number[]): void {

    this.mapVendors(vendorIds);

  }

  /**
   * isReady - Whether or not this instance is ready to be used.  This will be
   * immediately and synchronously true if a vendorlist object is passed into
   * the constructor or once the JSON vendorllist is retrieved.
   *
   * @return {boolean} whether or not the instance is ready to be interacted
   * with and all the data is populated
   */
  public get isReady(): boolean {

    return this.isReady_;

  }

  /**
   * clone - overrides base `clone()` method since GVL is a special class that
   * represents a JSON structure with some additional functionality
   *
   * @return {GVL}
   */
  public clone(): GVL {

    return new GVL(this.getJson());

  }

  public static isInstanceOf(questionableInstance: unknown): questionableInstance is GVL {

    const isSo = typeof questionableInstance === 'object';
    return (isSo && typeof (questionableInstance as GVL).narrowVendorsTo === 'function');

  }

}
