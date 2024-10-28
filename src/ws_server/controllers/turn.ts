import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {getClientConnection} from "../utils/getClientConnection";
import {GamesDb} from "../db/games.db";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {BOT_INDEX} from "../constants";

const gamesDb = GamesDb.getInstance()

/**
 * Help to decide who's turn is next
 * @param currentPlayerIndex - current player index
 * @param gameId
 */
export const turn = (currentPlayerIndex: number | string, gameId: number | string) => {
    const { players } = gamesDb.getGame(gameId)
    const [playerOne, playerTwo] = players

    const isPlayerOneNotBot = playerOne!.index != BOT_INDEX
    const isPlayerTwoNotBot = playerTwo!.index != BOT_INDEX

    const playerOneConnection = isPlayerOneNotBot ? getClientConnection({ playerIndex: playerOne!.playerId }) : ''
    const playerTwoConnection = isPlayerTwoNotBot ? getClientConnection({ playerIndex: playerTwo!.playerId }) : ''

    const message = prepareJsonResponse(
        MessageTypeEnum.Turn,
        JSON.stringify({
        currentPlayer: currentPlayerIndex === playerOne!.playerId ? playerTwo!.playerId : playerOne!.playerId
        })
    )

    playerOneConnection && playerOneConnection.send(message)
    playerTwoConnection && playerTwoConnection.send(message)
}
