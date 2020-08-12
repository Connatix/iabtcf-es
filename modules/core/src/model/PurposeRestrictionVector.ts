import { PurposeRestriction } from './PurposeRestriction';
import { BinarySearchTree } from './BinarySearchTree';
import { RestrictionType } from './RestrictionType';
import { GVL } from '../GVL';
import { Vendor } from './gvl/Vendor';
import { Cloneable } from '../Cloneable';

export class PurposeRestrictionVector extends Cloneable<PurposeRestrictionVector> {

  /**
   * if this originatd from an encoded string we'll need a place to store the
   * bit length; it can be set and got from here
   */
  public bitLength = 0;

  /**
   * a map indexed by a string which will be a 'hash' of the purpose and
   * restriction type.
   *
   * Using a BST to keep vendors in a sorted order for encoding later
   */
  private map: Map<string, BinarySearchTree> = new Map<string, BinarySearchTree>();
  private gvl_: GVL;

  private has(hash: string): boolean {

    return this.map.has(hash);

  }

  private isOkToHave(restrictionType: RestrictionType, purposeId: number, vendorId: number): boolean {

    const vIDStr: string = vendorId.toString();
    let result = true;

    /**
     * without a gvl set, there's no way to know... in that case we'll return
     * true but once the GVL is set later we'll go through these and clean up
     * the mess.
     */
    if (this.gvl?.vendors) {

      if (this.gvl.vendors[vIDStr]) {

        const vendor: Vendor = this.gvl.vendors[vIDStr];

        if (restrictionType === RestrictionType.NOT_ALLOWED) {

          /**
           * if it's "not allowed" then flexible declaration is ignored but if
           * if it isn't even listed as one of the purposes the vendor uses,
           * then there is no reason to encode the value so check both arrays
           * to see if it exists.  If it does then we can restrict it.
           */

          result = (vendor.legIntPurposes.includes(purposeId) || vendor.purposes.includes(purposeId));

        } else if (vendor.flexiblePurposes.length) {

          switch (restrictionType) {

            /**
             * If the vendor has the purposeId in flexiblePurposes and it is
             * listed as a legitimate interest purpose we can set the
             * override to require consent.
             */
            case RestrictionType.REQUIRE_CONSENT:
              result = (vendor.flexiblePurposes.includes(purposeId) && vendor.legIntPurposes.includes(purposeId));

            /**
             * If the vendor has the purposeId in flexiblePurposes and it is
             * listed as a consent purpose we can set the
             * override to require legitimate interest.
             */
            case RestrictionType.REQUIRE_LI:
              result = (vendor.flexiblePurposes.includes(purposeId) && vendor.purposes.includes(purposeId));

          }

        }

      } else {

        // this vendor doesn't exist
        result = false;

      }

    }

    // if the gvl isn't defined, we can't do anything until later
    return result;

  }

  /**
   * add - adds a given Vendor ID under a given Purpose Restriction
   *
   * @param {number} vendorId
   * @param {PurposeRestriction} purposeRestriction
   * @return {void}
   */
  public add(vendorId: number, purposeRestriction: PurposeRestriction): void {

    if (this.isOkToHave(purposeRestriction.restrictionType, purposeRestriction.purposeId, vendorId)) {

      const hash: string = purposeRestriction.hash;

      if (!this.has(hash)) {

        this.map.set(hash, new BinarySearchTree());
        this.bitLength = 0;

      }

      const currentRestrictions = this.getRestrictions(vendorId);
      currentRestrictions.forEach((curRestriction: PurposeRestriction): void => {

        /**
         * if this vendor is already restricted under this purpose they can only
         * be restricted in one way so we'll remove them from the other one.
         * It's a last value wins result
         */
        if (curRestriction.purposeId === purposeRestriction.purposeId) {

          this.remove(vendorId, curRestriction);

        }

      });

      (this.map.get(hash) as BinarySearchTree).add(vendorId);

    }

  }

  public getRestrictions(vendorId?: number): PurposeRestriction[] {

    const retr: PurposeRestriction[] = [];

    this.map.forEach((bst: BinarySearchTree, hash: string): void => {

      if (vendorId) {

        if (bst.contains(vendorId)) {

          retr.push(PurposeRestriction.unHash(hash));

        }

      } else {

        retr.push(PurposeRestriction.unHash(hash));

      }

    });

    return retr;

  }

  /**
   * remove - removes Vendor ID from a Purpose Restriction
   *
   * @param {number} vendorId
   * @param {PurposeRestriction} purposeRestriction
   * @return {void}
   */
  public remove(vendorId: number, purposeRestriction: PurposeRestriction): void {

    const hash: string = purposeRestriction.hash;
    const bst: BinarySearchTree | undefined = this.map.get(hash);

    if (bst) {

      bst.remove(vendorId);

      // if it's empty let's delete the key so it doesn't show up empty
      if (bst.isEmpty()) {

        this.map.delete(hash);
        this.bitLength = 0;

      }

    }

  }

  /**
   * Essential for being able to determine whether we can actually set a
   * purpose restriction since they have to have a flexible legal basis
   *
   * @param {GVL} value - the GVL instance
   */
  public set gvl(value: GVL) {

    if (!this.gvl_) {

      this.gvl_ = value;

      /**
       * if we have restrictions set before the gvl is set then we'll have to
       * go through and remove some if they're not valid
       */

      this.map.forEach((bst: BinarySearchTree, hash: string): void => {

        const purposeRestriction: PurposeRestriction = PurposeRestriction.unHash(hash);
        const vendors: number[] = bst.get();

        vendors.forEach((vendorId: number): void => {

          if (!this.isOkToHave(purposeRestriction.restrictionType, purposeRestriction.purposeId, vendorId)) {

            bst.remove(vendorId);

          }

        });

      });

    }

  }

  /**
   * gvl returns local copy of the GVL these restrictions apply to
   *
   * @return {GVL}
   */
  public get gvl(): GVL {

    return this.gvl_;

  }

  /**
   * isEmpty - whether or not this vector has any restrictions in it
   *
   * @return {boolean}
   */
  public isEmpty(): boolean {

    return this.map.size === 0;

  };

}
