import {RawData, Server, type WebSocket} from 'ws';
import {MessageTypeEnum} from "./enums/MessageTypeEnum";
import type {AddShipsType, AddUserToRoomType, ClientMessageType, LoginCreateType} from "./types/ClientMessageType";
import {createLoginClient} from "./controllers/createLoginClient";
import {createRoom} from "./controllers/createRoom";
import {addClientToRoom} from "./controllers/addClientToRoom";
import {addShips} from "./controllers/addShips";

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
        console.log('User was disconnected');
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
            attack(clientMessageWithParsedData, ws)
            break
        }
        case MessageTypeEnum.RandomAttack: {
            randomAttack(clientMessageWithParsedData, ws)
            break
        }
        default: {
            console.log('Unknown message type')
        }
    }
}

const attack = (clientMessage: ClientMessageType, ws: WebSocket) => {
    console.log('attack',clientMessage, ws.send)
}

const randomAttack = (clientMessage: ClientMessageType, ws: WebSocket) => {
    console.log('randomAttack',clientMessage, ws.send)
}
