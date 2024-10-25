import {ShipInfoType, WsMessageType} from "./CommonTypes";

export type ClientMessageType<T = DefaultTypes> = WsMessageType<T>

type DefaultTypes =   LoginCreateType |
    CreateRoomType |
    AddUserToRoomType |
    AddShipsType |
    AttackType |
    RandomAttackType

export type LoginCreateType = {
    name: string
    password: string
}

export type CreateRoomType = ''

export type AddUserToRoomType = {
    indexRoom: number | string
}

export type AddShipsType = {
    gameId: number | string
    ships: ShipInfoType[]
    indexPlayer: number | string
}

export type AttackType = {
    gameId: number | string
    x: number
    y: number
    indexPlayer: number | string
}

export type RandomAttackType = {
    gameId: number | string
    indexPlayer: number | string
}
