import {GameModel} from "../models/GameModel";
import {ShipInfoType} from "../types/CommonTypes";
import type {AttackType} from "../types/ClientMessageType";
import {AttackStatusEnum} from "../enums/AttackStatusEnum";
import {ShipSizeEnum} from "../enums/ShipSizeEnum";

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
            playerId: clientOneIndex,
            ships: [],
            shipsStatus: [],
            index: clientOneIndex
        }

        const playerTwo = {
            playerId: clientTwoIndex,
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
                                shipsStatus: ships,
                                attackStory: []
                            };
                        }

                        return player;
                    })
                };
            }
            return game;
        });
    }

    checkAttackResults(data: AttackType): { attackResult: AttackStatusEnum | '', nextAttackPlayerId: number | string, isGameFinish: boolean  } {
        const { gameId, indexPlayer, x, y } = data
        let currentGame = this.games.find(game => game.idGame === gameId)

        const TEST_MODE = currentGame?.players.map(player => player.index)[0] == currentGame?.players.map(player => player.index)[1]

        const enemyPlayer = TEST_MODE ?
            currentGame?.players.find(player => player.playerId == indexPlayer) :
            currentGame?.players.find(player => player.playerId != indexPlayer)

        const enemyPlayerId = enemyPlayer?.playerId

        let enemyShipsStart = TEST_MODE ?
            currentGame?.players.find(player => player.playerId == indexPlayer)?.ships :
            currentGame?.players.find(player => player.playerId != indexPlayer)?.ships

        let enemyShips = TEST_MODE ?
            currentGame?.players.find(player => player.playerId == indexPlayer)?.shipsStatus :
            currentGame?.players.find(player => player.playerId != indexPlayer)?.shipsStatus


        let result: AttackStatusEnum | '' = AttackStatusEnum.Miss

        const attackXY = `${x}${y}`
        const wasTheSamePositionAttackedAgain = (enemyPlayer?.attackStory ?? []).includes(attackXY)

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

            if (shipPositions.includes(attackXY)) {
                const hasShipLengthAfterAttack = wasTheSamePositionAttackedAgain ?
                    !!ship.length :
                    ship.length  > 1

                if (hasShipLengthAfterAttack) {
                    result = AttackStatusEnum.Shot
                    return {
                        ...ship,
                        length: wasTheSamePositionAttackedAgain ? ship.length : ship.length - 1
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
                const isClientPlayer = TEST_MODE ?
                    player.playerId != indexPlayer :
                    player.playerId == indexPlayer

                    if ( isClientPlayer) {
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

        const TEST_MODE = currentGame?.players.map(player => player.index)[0] == currentGame?.players.map(player => player.index)[1]

        let enemyAttackStory = TEST_MODE ?
            currentGame?.players.find(player => player.playerId == indexPlayer)?.attackStory ?? [] :
            currentGame?.players.find(player => player.playerId != indexPlayer)?.attackStory ?? []

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

    createShipsForBot(): ShipInfoType[] {
        return [
            {
                position: { x: 2, y: 0 },
                direction: true,
                type: ShipSizeEnum.Huge,
                length: 4
            },
            {
                position: { x: 8, y: 1 },
                direction: true,
                type: ShipSizeEnum.Large,
                length: 3
            },
            {
                position: { x: 3, y: 9 },
                direction: false,
                type: ShipSizeEnum.Large,
                length: 3
            },
            {
                position: { x: 1, y: 6 },
                direction: false,
                type: ShipSizeEnum.Medium,
                length: 2
            },
            {
                position: { x: 4, y: 6 },
                direction: false,
                type: ShipSizeEnum.Medium,
                length: 2
            },
            {
                position: { x: 4, y: 0 },
                direction: false,
                type: ShipSizeEnum.Medium,
                length: 2
            },
            {
                position: { x: 1, y: 8 },
                direction: true,
                type: ShipSizeEnum.Small,
                length: 1
            },
            {
                position: { x: 5, y: 3 },
                direction: true,
                type: ShipSizeEnum.Small,
                length: 1
            },
            {
                position: { x: 8, y: 8 },
                direction: false,
                type: ShipSizeEnum.Small,
                length: 1
            },
            {
                position: { x: 0, y: 2 },
                direction: false,
                type: ShipSizeEnum.Small,
                length: 1
            }
        ]

    }
}
