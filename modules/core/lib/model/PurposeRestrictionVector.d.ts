import { PurposeRestriction } from './PurposeRestriction';
import { GVL } from '../GVL';
import { Cloneable } from '../Cloneable';
export declare class PurposeRestrictionVector extends Cloneable<PurposeRestrictionVector> {
    /**
     * if this originatd from an encoded string we'll need a place to store the
     * bit length; it can be set and got from here
     */
    bitLength: number;
    /**
     * a map indexed by a string which will be a 'hash' of the purpose and
     * restriction type.
     *
     * Using a BST to keep vendors in a sorted order for encoding later
     */
    private map;
    private gvl_;
    private has;
    private isOkToHave;
    /**
     * add - adds a given Vendor ID under a given Purpose Restriction
     *
     * @param {number} vendorId
     * @param {PurposeRestriction} purposeRestriction
     * @return {void}
     */
    add(vendorId: number, purposeRestriction: PurposeRestriction): void;
    getRestrictions(vendorId?: number): PurposeRestriction[];
    /**
     * remove - removes Vendor ID from a Purpose Restriction
     *
     * @param {number} vendorId
     * @param {PurposeRestriction} purposeRestriction
     * @return {void}
     */
    remove(vendorId: number, purposeRestriction: PurposeRestriction): void;
    /**
     * Essential for being able to determine whether we can actually set a
     * purpose restriction since they have to have a flexible legal basis
     *
     * @param {GVL} value - the GVL instance
     */
    set gvl(value: GVL);
    /**
     * gvl returns local copy of the GVL these restrictions apply to
     *
     * @return {GVL}
     */
    get gvl(): GVL;
    /**
     * isEmpty - whether or not this vector has any restrictions in it
     *
     * @return {boolean}
     */
    isEmpty(): boolean;
}
