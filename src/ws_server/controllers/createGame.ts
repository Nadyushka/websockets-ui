import {ConnectionsDb} from "../db/connections.db";
import {RoomsDb} from "../db/rooms.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {GamesDb} from "../db/games.db";
import {BOT_INDEX} from "../constants";

const connectionsDb = ConnectionsDb.getInstance()
const roomsDb = RoomsDb.getInstance()
const gamesDb = GamesDb.getInstance()

export const createGame = (indexRoom: string | number) => {
    const { roomUsers } = roomsDb.getRoom(indexRoom)
    const [playerOne, playerTwo] =  roomUsers

    const playerOneIsNotABot = playerOne!.index != BOT_INDEX
    const playerTwoIsNotABot = playerTwo!.index != BOT_INDEX

    const userOneConnection = playerOneIsNotABot ? connectionsDb.getConnection(playerOne!.index) : ''
    const userTwoConnection = playerTwoIsNotABot ? connectionsDb.getConnection(playerTwo!.index) : ''

    const { idGame, players} = gamesDb.createGame(playerOne!.index, playerTwo!.index)

    const idForGame = idGame
    const idForPlayerOne = players[0]!.playerId
    const idForPlayerTwo = players[1]!.playerId

    const responseOne = prepareJsonResponse(MessageTypeEnum.CreateGame, JSON.stringify({idGame: idForGame, idPlayer: idForPlayerOne}))
    const responseTwo = prepareJsonResponse(MessageTypeEnum.CreateGame, JSON.stringify({idGame: idForGame, idPlayer: idForPlayerTwo}))

    userOneConnection &&  userOneConnection.send(responseOne)
    userTwoConnection &&  userTwoConnection.send(responseTwo)
}
