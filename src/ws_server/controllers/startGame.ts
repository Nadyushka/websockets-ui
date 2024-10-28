import {GamesDb} from "../db/games.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {turn} from "./turn";
import {getClientConnection} from "../utils/getClientConnection";
import {BOT_INDEX} from "../constants";

const games = GamesDb.getInstance()

export const startGame = (idGame: number | string) => {
    const game = games.getGame(idGame)

    const [playerOne, playerTwo] = game.players

    const playerOneIsNotABot = playerOne!.index != BOT_INDEX
    const playerTwoIsNotABot = playerTwo!.index != BOT_INDEX

    const playerOneConnection = playerOneIsNotABot ? getClientConnection({ playerIndex: playerOne!.playerId }) : ''
    const playerTwoConnection = playerTwoIsNotABot ? getClientConnection({ playerIndex: playerTwo!.playerId }) : ''

    const messageOne = prepareJsonResponse(
        MessageTypeEnum.StartGame,
       JSON.stringify( {
            ships: playerOne!.ships,
            currentPlayerIndex: playerOne!.playerId
        })
        )

    const messageTwo = prepareJsonResponse(
        MessageTypeEnum.StartGame,
        JSON.stringify( {
            ships: playerTwo!.ships,
            currentPlayerIndex: playerTwo!.playerId
        })
    )

    playerOneConnection && playerOneConnection.send(messageOne)
    playerTwoConnection && playerTwoConnection.send(messageTwo)

    turn(playerTwo!.playerId, idGame)
}
