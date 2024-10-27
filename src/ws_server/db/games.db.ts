import {GameModel} from "../models/GameModel";
import {ShipInfoType} from "../types/CommonTypes";
import type {AttackType} from "../types/ClientMessageType";
import {AttackStatusEnum} from "../enums/AttackStatusEnum";

export class GamesDb {
    public static instance: GamesDb;

    public static getInstance() {
        if (!GamesDb.instance) {
            GamesDb.instance = new GamesDb();
        }
        return GamesDb.instance;
    }

    private games: GameModel[] = []

    getGames() {
        return this.games
    }

    getGame(idGame: string | number):GameModel  {
        return this.games.find(game => game.idGame === idGame)!
    }

    getGameByPlayerId(playerId:  string | number):GameModel {
        return this.games.find(game => game.players.map(player => player.playerId).includes(playerId))!
    }

    /**
     *  Create new game
     */
    createGame(clientOneIndex: string | number, clientTwoIndex: string | number): GameModel {
        const idGame = new Date().getTime().toString()
        const playerOne = {
            playerId: new Date().getTime().toString(),
            ships: [],
            shipsStatus: [],
            index: clientOneIndex
        }
        const playerTwo = {
            playerId: new Date().getTime().toString(),
            ships: [],
            shipsStatus: [],
            index: clientTwoIndex
        }

        const newGame: GameModel = {
            idGame,
            players: [playerOne, playerTwo]
        }

        this.games.push(newGame)

        return newGame
    }

    addShips(idGame: string | number  , ships: ShipInfoType[], playerId: string | number) {
        this.games = this.games.map(game => {
            if (game.idGame == idGame) {
                return {
                    ...game,
                    players: game.players.map(player => {

                        if (player.playerId === playerId) {
                            return {
                                ...player,
                                ships: ships,
                                shipsStatus: ships
                            };
                        }
                        return player;
                    })
                };
            }
            return game;
        });
    }

    checkAttackResults(data: AttackType): AttackStatusEnum {
        const { gameId, indexPlayer, x, y } = data
        let currentGame = this.games.find(game => game.idGame === gameId)
        //TODO change  let enemyShips = currentGame?.players.find(player => player.playerId != indexPlayer)?.shipsStatus
        let enemyShips = currentGame?.players.find(player => player.playerId == indexPlayer)?.shipsStatus

        let result = AttackStatusEnum.Miss

        enemyShips = enemyShips!.map(ship => {
           let shipPositions = []

            let shipY = ship.position.y
            let shipX = ship.position.x

            for (let i = 0; i < ship.length; i++) {
                if (ship.direction) {
                    shipPositions.push(`${shipX}${shipY + i}`)
                } else {
                    shipPositions.push(`${shipX + i}${shipY}`)
                }
            }

            const attackXY = `${x}${y}`

            if (shipPositions.includes(attackXY)) {
                const hasShipLengthAfterAttack = ship.length  > 1

                if (hasShipLengthAfterAttack) {
                    result = AttackStatusEnum.Shot
                    return {
                        ...ship,
                        length: ship.length - 1
                    }
                } else {
                    result =  AttackStatusEnum.Killed
                    return {
                        ...ship,
                        length: 0
                    }
                }

            } else {
                return ship
            }
        })

        currentGame = {
            idGame: currentGame!.idGame,
            players: currentGame!.players.map(player => {
                //TODO change on player.playerId == indexPlayer
                    if (player.playerId != indexPlayer) {
                        return player
                    } else {
                        return {
                            ...player,
                            shipsStatus: enemyShips
                        }
                    }
                })
        }

        this.games = this.games.map(game => {
            if (game.idGame !== gameId) {
                return game
            } else {
                return currentGame!
            }
        })

        return result!
    }
}
