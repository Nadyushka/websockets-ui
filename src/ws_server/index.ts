import {RawData, Server, type WebSocket} from 'ws';
import {MessageTypeEnum} from "./enums/MessageTypeEnum";
import {ClientMessageType, CreateRoomType, LoginCreateType} from "./types/ClientMessageType";
import {createLoginClient} from "./controllers/createLoginClient";
import {createRoom} from "./controllers/createRoom";


export const startWsServer = () => {
    const PORT = process.env.PORT || 3000
    const wsServer = new Server({port: +PORT})

    wsServer.on('connection', onConnection);
    wsServer.on('error', error => {
        console.error(error);
    });
    console.log(`WebSocket server is listening on port! ${PORT}`);
}

export const onConnection = (ws: WebSocket) => {
    ws.on('error', error => {
        console.error(error);
    });

    ws.on('close', () => {
        console.log('User was disconnected');
    });

    ws.on('message', (rawData: RawData) => {
        incomingClientMessageHandler(rawData, ws)
    })

}

export const incomingClientMessageHandler = (rawData: RawData, ws: WebSocket) => {
    const clientMessage: ClientMessageType = JSON.parse(rawData.toString())

    if (!clientMessage || !clientMessage.data) {
        console.error('No data was provided in message')
        return
    }

    const clientMessageWithParsedData = {
        ...clientMessage,
        data: JSON.parse(clientMessage.data.toString())
    }

    switch (clientMessage.type) {
        case MessageTypeEnum.Registration: {
            createLoginClient(clientMessageWithParsedData as ClientMessageType<LoginCreateType>, ws)
            break
        }
        case MessageTypeEnum.CreateRoom: {
            createRoom(clientMessage as ClientMessageType<CreateRoomType>, ws)
            break
        }
        case MessageTypeEnum.AddUserToRoom: {
            addClientToRoom(clientMessage, ws)
            break
        }
        case MessageTypeEnum.AddShips: {
            addShips(clientMessage, ws)
            break
        }
        case MessageTypeEnum.Attack: {
            attack(clientMessage, ws)
            break
        }
        case MessageTypeEnum.RandomAttack: {
            randomAttack(clientMessage, ws)
            break
        }
        default: {
            console.log('Unknown message type')
        }
    }
}

const addClientToRoom = (clientMessage: ClientMessageType, ws: WebSocket) => {
    console.log('addClientToRoom',clientMessage, ws.send)
}

const addShips = (clientMessage: ClientMessageType, ws: WebSocket) => {
    console.log('addShips',clientMessage, ws.send)
}

const attack = (clientMessage: ClientMessageType, ws: WebSocket) => {
    console.log('attack',clientMessage, ws.send)
}

const randomAttack = (clientMessage: ClientMessageType, ws: WebSocket) => {
    console.log('randomAttack',clientMessage, ws.send)
}
