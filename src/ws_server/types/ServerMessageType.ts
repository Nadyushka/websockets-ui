import {ShipInfoType, WsMessageType} from "./CommonTypes";
import {AttackStatusEnum} from "../enums/AttackStatusEnum";

export type ServerMessageType<T = DefaultTypes> = WsMessageType<T>

type DefaultTypes =  LoginCreateType |
    UpdateRoomType |
    UpdateWinsType |
    CreateGameType |
    StartGameType |
    TurnType |
    AttackType |
    FinishType

export type LoginCreateType = {
    name: string
    index: number | string
    error: boolean
    errorText: string
}

type RoomUserType = {
    name: string
    index: number | string
}

type UpdateRoomType =  {
    roomId: number | string,
    roomUsers: RoomUserType[]
}

type UpdateWinsType = {
    name: string
    wins: number
}

type CreateGameType = {
    idGame: number | string,
    idPlayer: number | string,
}

type StartGameType = {
    currentPlayerIndex: number | string
    ships: ShipInfoType[]
}

type TurnType = {
    currentPlayer: number | string
}

type AttackType = {
    position:
        {
            x: number,
            y: number
        },
    currentPlayer: number | string
    status: AttackStatusEnum
}

type FinishType = {
    winPlayer: number | string
}
