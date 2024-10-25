import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {ShipSizeEnum} from "../enums/ShipSizeEnum";

export type WsMessageType<T> = {
    type: MessageTypeEnum
    data: T
    id: number
}

export type ShipInfoType = {
    position: {
        x: number
        y: number
    },
    direction: boolean,
    length: number,
    type: ShipSizeEnum,
}
