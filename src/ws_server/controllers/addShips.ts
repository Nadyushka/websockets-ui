import type {AddShipsType, ClientMessageType} from "../types/ClientMessageType";
import {GamesDb} from "../db/games.db";
import {startGame} from "./startGame";
import {BOT_INDEX} from "../constants";

const games = GamesDb.getInstance()

export const addShips = (clientMessage: ClientMessageType<AddShipsType>) => {
    const { gameId, ships, indexPlayer } = clientMessage.data

    games.addShips(gameId, ships, indexPlayer)

    let currentGame = games.getGame(gameId)

    const isGameWithBot = !!games.getGame(gameId).players.find(player => player.index == BOT_INDEX)

    if (isGameWithBot) {
        const shipsForBot = games.createShipsForBot()
       games.addShips(gameId, shipsForBot, BOT_INDEX)
    }

    currentGame = games.getGame(gameId)

    const isTwoPlayersAddShips =
        currentGame.players.length === 2 &&
        currentGame.players.every(player => player.ships.length > 0)

    if (isTwoPlayersAddShips) {
        startGame(gameId);
    }
}
