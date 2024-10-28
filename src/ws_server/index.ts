import {RawData, Server, type WebSocket} from 'ws';
import {MessageTypeEnum} from "./enums/MessageTypeEnum";
import type {
    AddShipsType,
    AddUserToRoomType,
    AttackType,
    ClientMessageType,
    LoginCreateType, RandomAttackType
} from "./types/ClientMessageType";
import {createLoginClient} from "./controllers/createLoginClient";
import {createRoom} from "./controllers/createRoom";
import {addClientToRoom} from "./controllers/addClientToRoom";
import {addShips} from "./controllers/addShips";
import {attack} from "./controllers/attack";
import {randomAttack} from "./controllers/randomAttack";
import {singleMode} from "./controllers/singleMode";
import {GamesDb} from "./db/games.db";
import {finish} from "./controllers/finish";
import {ConnectionsDb} from "./db/connections.db";

const gamesDB = GamesDb.getInstance()
const connectionsDb = ConnectionsDb.getInstance()

export const startWsServer = () => {
    const PORT = process.env.PORT || 3000
    const wsServer = new Server({port: +PORT})

    wsServer.on('connection', onConnection);
    wsServer.on('error', error => {
        console.error(error);
    });
    console.log(`WebSocket server is listening on port! ${PORT}`);
}

export const onConnection = (ws: WebSocket ) => {
    const clientIndex = new Date().getTime().toString();

    ws.on('error', error => {
        console.error(error);
    });

    ws.on('close', () => {
        try {
            const gameWithDisconnectedPlayer = gamesDB.getGameByPlayerId(clientIndex)
            const playerThatLeftConnected = gameWithDisconnectedPlayer.players.find(player => player.index != clientIndex)

            if ( playerThatLeftConnected ) {
                finish(playerThatLeftConnected.index, gameWithDisconnectedPlayer.idGame)
                connectionsDb.deleteConnection(clientIndex)
            }

            console.log('User was disconnected');
        } catch (e) {
            console.error('onConnection error: ', e)
        }

    });

    ws.on('message', (rawData: RawData) => {
        incomingClientMessageHandler(rawData, ws, clientIndex)
    })

}

export const incomingClientMessageHandler = (rawData: RawData, ws: WebSocket, clientIndex: string) => {
    const clientMessage = JSON.parse(rawData.toString())

    const clientMessageWithParsedData: ClientMessageType  = {
        ...clientMessage,
        data: clientMessage.data ?
            JSON.parse(clientMessage.data.toString()) :
            ''
    }

    switch (clientMessage.type) {
        case MessageTypeEnum.Registration: {
            createLoginClient(clientMessageWithParsedData as ClientMessageType<LoginCreateType>, ws, clientIndex)
            break
        }
        case MessageTypeEnum.CreateRoom: {
            createRoom(clientIndex)
            break
        }
        case MessageTypeEnum.AddUserToRoom: {
            addClientToRoom(clientMessageWithParsedData as ClientMessageType<AddUserToRoomType>, clientIndex)
            break
        }
        case MessageTypeEnum.AddShips: {
            addShips(clientMessageWithParsedData as ClientMessageType<AddShipsType>)
            break
        }
        case MessageTypeEnum.Attack: {
            attack(clientMessageWithParsedData as ClientMessageType<AttackType>)
            break
        }
        case MessageTypeEnum.RandomAttack: {
            randomAttack(clientMessageWithParsedData as ClientMessageType<RandomAttackType>)
            break
        }
        case MessageTypeEnum.SinglePlay:{
            singleMode(clientIndex)
            break
        }
        default: {
            console.log('Unknown message type')
        }
    }
}
