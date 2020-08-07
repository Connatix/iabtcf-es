import { Ping } from '../response';
import { Command } from './Command';
export declare class PingCommand extends Command {
    protected getResponse(): Promise<Ping>;
}
