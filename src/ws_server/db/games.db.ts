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

    /** Delete game */

    deleteGame (gameId: string | number) {
        this.games = this.games.filter(game => game.idGame != gameId)
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

    checkAttackResults(data: AttackType): { attackResult: AttackStatusEnum, nextAttackPlayerId: number | string, isGameFinish: boolean  } {
        const { gameId, indexPlayer, x, y } = data
        let currentGame = this.games.find(game => game.idGame === gameId)
        //TODO change  enemyPlayerId = currentGame?.players.find(player => player.playerId != indexPlayer).playerId
        const enemyPlayerId = currentGame?.players.find(player => player.playerId == indexPlayer)?.playerId

        //TODO change  let enemyShipsStart = currentGame?.players.find(player => player.playerId != indexPlayer)?.ships
        let enemyShipsStart = currentGame?.players.find(player => player.playerId == indexPlayer)?.ships

        //TODO change  let enemyShips = currentGame?.players.find(player => player.playerId != indexPlayer)?.shipsStatus
        let enemyShips = currentGame?.players.find(player => player.playerId == indexPlayer)?.shipsStatus


        let result = AttackStatusEnum.Miss

        // check each ship and update length if ship was attacked
        enemyShips = enemyShips!.map((ship, index) => {
           let shipPositions = []

            let shipY = ship.position.y
            let shipX = ship.position.x

            for (let i = 0; i < enemyShipsStart![index]!.length; i++) {
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
                            shipsStatus: enemyShips,
                            attackStory: player.attackStory ? [...player.attackStory, `${x}${y}`] : []
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

        const isThereShipToAttack = enemyShips.filter(ship => ship.length > 0).length

        return {
            attackResult: result!,
            nextAttackPlayerId: result == AttackStatusEnum.Miss ? indexPlayer! : enemyPlayerId!,
            isGameFinish: !isThereShipToAttack
        }
    }

    getRandomPositionForAttack(gameId: number | string, indexPlayer: number | string): { x: number, y: number } {
        let currentGame = this.games.find(game => game.idGame === gameId)

        //TODO change  let enemyShips = currentGame?.players.find(player => player.playerId != indexPlayer)?.shipsStatus
        let enemyAttackStory = currentGame?.players.find(player => player.playerId == indexPlayer)?.attackStory ?? []

        let randomAttack
        do {
            const x = Math.floor(Math.random()*10)
            const y = Math.floor(Math.random()*10)

            randomAttack = `${x}${y}`
        } while(enemyAttackStory.includes(randomAttack))

        return {
            x: +randomAttack.slice(0, 1),
            y: +randomAttack.slice(1),
        }
    }
}
