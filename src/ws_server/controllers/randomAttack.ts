import type {ClientMessageType, RandomAttackType} from "../types/ClientMessageType";
import {attack} from "./attack";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {GamesDb} from "../db/games.db";

const gamesDb = GamesDb.getInstance()

export const randomAttack = (clientMessage: ClientMessageType<RandomAttackType>) => {
    const {  gameId, indexPlayer } = clientMessage.data

    const { x, y } = gamesDb.getRandomPositionForAttack(gameId, indexPlayer)

    const messageData = {
        gameId,
        indexPlayer,
        x,
        y
    }
    attack({
        type: MessageTypeEnum.Attack,
        data: messageData,
        id: 0
    })
}
