import type {AddShipsType, ClientMessageType} from "../types/ClientMessageType";
import {GamesDb} from "../db/games.db";
import {startGame} from "./startGame";

const games = GamesDb.getInstance()

export const addShips = (clientMessage: ClientMessageType<AddShipsType>) => {
    const { gameId, ships, indexPlayer } = clientMessage.data

    games.addShips(gameId, ships, indexPlayer)

    const currentGame = games.getGame(gameId)
    const isTwoPlayersAddShips =
        currentGame.players.length === 2 &&
        currentGame.players.every(player => player.ships.length)

    if (isTwoPlayersAddShips) {
        startGame(gameId);
    }
}
