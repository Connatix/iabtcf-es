import { Command } from './Command';
import { VendorList } from '@iabtcf/core';
/**
 * Gets a version of the Global Vendors List
 */
export declare class GetVendorListCommand extends Command {
    protected getResponse(): Promise<VendorList | null>;
}
