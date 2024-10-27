import type {AttackType, ClientMessageType} from "../types/ClientMessageType";
import {GamesDb} from "../db/games.db";
import {getClientConnection} from "../utils/getClientConnection";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {turn} from "./turn";

const gamesDb = GamesDb.getInstance()

export const attack = (clientMessage: ClientMessageType<AttackType>) => {
    const messageData = clientMessage.data
    const currentGame = gamesDb.getGameByPlayerId(messageData.indexPlayer)
    const [playerOne, playerTwo] = currentGame.players

    const playerOneConnection = getClientConnection({ playerIndex:playerOne!.playerId  })
    const playerTwoConnection = getClientConnection({ playerIndex:playerTwo!.playerId  })

    const result = gamesDb.checkAttackResults(messageData)

    const message = prepareJsonResponse(
        MessageTypeEnum.Attack,
        JSON.stringify({
            position:
                {
                    x: clientMessage.data.x,
                    y: clientMessage.data.y,
                },
            currentPlayer: clientMessage.data.indexPlayer,
            status: result,
        })
    )

    playerOneConnection.send(message)
    playerTwoConnection.send(message)

    turn(clientMessage.data.indexPlayer, currentGame.idGame)
}
