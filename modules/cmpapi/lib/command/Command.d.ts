import { CommandCallback } from './CommandCallback';
import { Response } from '../response/Response';
import { VendorList } from '@iabtcf/core';
/**
 * Base command class holds basic command parameters and has functionality to
 * handle basic validation.
 */
export declare abstract class Command {
    protected listenerId: number;
    protected callback: CommandCallback;
    protected next: CommandCallback;
    protected param: any;
    protected success: boolean;
    constructor(callback: CommandCallback, param?: any, listenerId?: number, next?: CommandCallback);
    private respond;
    protected abstract getResponse(): Promise<Response | VendorList | boolean | null>;
}
