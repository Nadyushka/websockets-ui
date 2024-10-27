import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {getClientConnection} from "../utils/getClientConnection";
import {GamesDb} from "../db/games.db";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";

const gamesDb = GamesDb.getInstance()

export const turn = (currentPlayerIndex: number | string, gameId: number | string) => {
    const { players } = gamesDb.getGame(gameId)
    const [playerOne, playerTwo] = players

    const playerOneConnection = getClientConnection({ playerIndex: playerOne!.playerId })
    const playerTwoConnection = getClientConnection({ playerIndex: playerTwo!.playerId })

    const message = prepareJsonResponse(
        MessageTypeEnum.Turn,
        JSON.stringify({
        currentPlayer: currentPlayerIndex === playerOne!.playerId ? playerTwo!.playerId : playerOne!.playerId
        })
    )

    playerOneConnection.send(message)
    playerTwoConnection.send(message)
}
