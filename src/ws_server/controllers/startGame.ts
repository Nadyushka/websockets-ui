import {GamesDb} from "../db/games.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {turn} from "./turn";
import {getClientConnection} from "../utils/getClientConnection";

const games = GamesDb.getInstance()

export const startGame = (idGame: number | string) => {
    const game = games.getGame(idGame)

    const [playerOne, playerTwo] = game.players

    const playerOneConnection = getClientConnection({ playerIndex: playerOne!.playerId })
    const playerTwoConnection = getClientConnection({ playerIndex: playerTwo!.playerId })

    const messageOne = prepareJsonResponse(
        MessageTypeEnum.StartGame,
       JSON.stringify( {
            ships: playerOne!.ships,
            currentPlayerIndex: playerOneConnection
        })
        )


    const messageTwo = prepareJsonResponse(
        MessageTypeEnum.StartGame,
        JSON.stringify( {
            ships: playerTwo!.ships,
            currentPlayerIndex: playerTwoConnection
        })
    )

    playerOneConnection.send(messageOne)
    playerTwoConnection.send(messageTwo)

    turn(playerOne!.playerId, idGame)
}
