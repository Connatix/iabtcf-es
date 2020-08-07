import { GetTCDataCommand } from './GetTCDataCommand';
import { TCData } from '../response/TCData';
export declare class AddEventListenerCommand extends GetTCDataCommand {
    protected getResponse(): Promise<TCData | null>;
}
