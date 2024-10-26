import {ClientMessageType, type CreateRoomType as ClientCreateRoomType} from "../types/ClientMessageType";
import type {WebSocket} from "ws";

export const createRoom = (clientMessage: ClientMessageType<ClientCreateRoomType>, ws: WebSocket) => {
    console.log('createRoom',clientMessage, ws)
}
