import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {ShipSizeEnum} from "../enums/ShipSizeEnum";
import {WebSocket} from "ws";

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

export type ConnectionType = {
    userIndex: string | number ,
    ws: WebSocket
}

export type PlayerType = {
    index: number | string,
    playerId: number | string,
    ships: Array<ShipInfoType>,
    shipsStatus: Array<ShipInfoType>
}
