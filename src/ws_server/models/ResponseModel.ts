import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {ServerMessageType} from "../types/ServerMessageType";

export class ResponseModel {
    type: MessageTypeEnum
    id: number = 0
    data: Pick<ServerMessageType, 'data'>


    constructor(obj: Partial<ResponseModel>) {
        Object.assign(this, obj)
    }
}
