import type {AttackType, ClientMessageType} from "../types/ClientMessageType";
import {GamesDb} from "../db/games.db";
import {getClientConnection} from "../utils/getClientConnection";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {turn} from "./turn";
import {finish} from "./finish";
import {BOT_INDEX} from "../constants";
import {randomAttack} from "./randomAttack";

const gamesDb = GamesDb.getInstance()

export const attack = (clientMessage: ClientMessageType<AttackType>) => {
    try {
        const messageData = clientMessage.data
        const currentGame = gamesDb.getGameByPlayerId(messageData.indexPlayer)

        const [playerOne, playerTwo] = currentGame.players

        const playerOneIsNotABot = playerOne!.index != BOT_INDEX
        const playerTwoIsNotABot = playerTwo!.index != BOT_INDEX

        const isGameWithBot = !playerOneIsNotABot || !playerTwoIsNotABot

        const playerOneConnection = playerOneIsNotABot ? getClientConnection({playerIndex: playerOne!.playerId}) : ''
        const playerTwoConnection = playerTwoIsNotABot ? getClientConnection({playerIndex: playerTwo!.playerId}) : ''

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
                status: result.attackResult,
            })
        )

        playerOneConnection && playerOneConnection.send(message)
        playerTwoConnection && playerTwoConnection.send(message)

        turn(result.nextAttackPlayerId, currentGame.idGame)

        const isNextAttackByBot = isGameWithBot && result.nextAttackPlayerId != BOT_INDEX

        if (isGameWithBot && isNextAttackByBot && !result.isGameFinish) {
            setTimeout(() => {
                randomAttack({
                    id: 0,
                    data: {
                        gameId: messageData.gameId,
                        indexPlayer: BOT_INDEX
                    },
                    type: MessageTypeEnum.Attack
                })
            }, 500)

            return
        }

        if (result.isGameFinish) {
            finish(messageData.indexPlayer, messageData.gameId)
        }
    } catch (e) {
        console.error('Attack error: ',e )
    }
}
