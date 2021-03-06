import { Cloneable } from '../Cloneable';
import { IntMap } from './IntMap';
declare type SingleIDOrCollection = number | number[] | IntMap<unknown> | Set<number | string>;
export declare type IdBoolTuple = [number, boolean];
/**
 * Vector class is like a Set except it keeps track of a max id
 */
declare class Vector extends Cloneable<Vector> implements Iterable<IdBoolTuple> {
    /**
     * if this originatd from an encoded string we'll need a place to store the
     * bit length; it can be set and got from here
     */
    bitLength: number;
    private maxId_;
    /**
     * keep a set for faster lookup
     */
    private set_;
    [Symbol.iterator](): Iterator<IdBoolTuple>;
    /**
     * maxId
     *
     * @return {number} - the highest id in this Vector
     */
    get maxId(): number;
    /**
     * get
     *
     * @param {number} id - key for value to check
     * @return {boolean} - value of that key, if never set it will be false
     */
    has(id: number): boolean;
    /**
     * unset
     *
     * @param {SingleIDOrCollection} id - id or ids to unset
     * @return {void}
     */
    unset(id: SingleIDOrCollection): void;
    private isIntMap;
    private isValidNumber;
    private isSet;
    /**
     * set - sets an item assumed to be a truthy value by its presence
     *
     * @param {SingleIDOrCollection} item - May be a single id (positive integer)
     * or collection of ids in a set, GVL Int Map, or Array.
     *
     * @return {void}
     */
    set(item: SingleIDOrCollection): void;
    empty(): void;
    /**
     * forEach - to traverse from id=1 to id=maxId in a sequential non-sparse manner
     *
     *
     * @param {forEachCallback} callback - callback to execute
     * @return {void}
     *
     * @callback forEachCallback
     * @param {boolean} value - whether or not this id exists in the vector
     * @param {number} id - the id number of the current iteration
     */
    forEach(callback: (value: boolean, id: number) => void): void;
    get size(): number;
}
export { Vector };
