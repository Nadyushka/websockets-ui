import {PlayerType } from "../types/CommonTypes";

export class GameModel {
    idGame: number | string
    players: PlayerType[] = []

    constructor(obj: Partial<GameModel>) {
        Object.assign(this, obj)
    }

}
