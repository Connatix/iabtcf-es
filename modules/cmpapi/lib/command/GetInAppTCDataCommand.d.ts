import { GetTCDataCommand } from './GetTCDataCommand';
import { InAppTCData } from '../response';
export declare class GetInAppTCDataCommand extends GetTCDataCommand {
    protected getResponse(): Promise<InAppTCData>;
}
