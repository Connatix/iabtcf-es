import { Command } from './Command';
import { TCData } from '../response';
export declare class GetTCDataCommand extends Command {
    protected getResponse(): Promise<TCData>;
    protected throwIfParamInvalid(): void;
}
