import {ClientMessageType, type LoginCreateType as ClientLoginCreateType} from "../types/ClientMessageType";
import type {WebSocket} from "ws";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {UsersDb} from "../db/users.db";
import {type LoginCreateType} from "../types/ServerMessageType";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {ConnectionsDb} from "../db/wsConnections.db";
import {updateWinners} from "./updateWinners";
import {updateRooms} from "./updateRooms";

const usersDb = UsersDb.getInstance()
const connectionDb = ConnectionsDb.getInstance()

export const createLoginClient = (clientMessage: ClientMessageType<ClientLoginCreateType>, ws: WebSocket) => {
    const { name, password} = clientMessage.data;
    if (!name || !password) {
        ws.send(prepareJsonResponse(
            MessageTypeEnum.Registration,
            JSON.stringify({
                    name: '',
                    password: '',
                    error: '400',
                    message: 'Name and Password are required fields'
                }
        )
        ))
        return
    }

    const isUserExist = usersDb.ifUserExistByNameCheck(name)

    let result: LoginCreateType = {
        error: true,
        index: '',
        name,
        errorText: 'Some error happened'
    }

    if (isUserExist) {
        result =  usersDb.loginUser({ name, password})
    } else {
        result = usersDb.createUser({ name, password})
    }

    ws.send(
        prepareJsonResponse( MessageTypeEnum.Registration,
            JSON.stringify({
                data: result
            })
        ))

    if (result?.error) return

    connectionDb.addConnection( {
        userIndex: result!.index,
        ws: ws
    })

    updateRooms()
    updateWinners()
}
