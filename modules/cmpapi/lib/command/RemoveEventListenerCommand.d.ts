import { Command } from './Command';
export declare class RemoveEventListenerCommand extends Command {
    protected getResponse(): Promise<boolean>;
}
