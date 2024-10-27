import {GamesDb} from "../db/games.db";
import {ConnectionsDb} from "../db/connections.db";
import {WebSocket} from "ws";

const gamesDb = GamesDb.getInstance()
const connectionsDb = ConnectionsDb.getInstance()

export const getClientConnection = (clientData:clientDataType): WebSocket => {
    let connection
    if (clientData.playerIndex) {
        const games = gamesDb.getGames()
        const gamesPlayers = games.flatMap(game => game.players)

        const clientIndex = gamesPlayers.find(player => player.playerId == clientData.playerIndex)!.index

        connection = connectionsDb.getConnection(clientIndex)
    }

    if (clientData.clientIndex) {
        connection = connectionsDb.getConnection(clientData.clientIndex)
    }

    return connection!
}

export type clientDataType = {
    playerIndex?: string | number
    clientIndex?: string | number
}
