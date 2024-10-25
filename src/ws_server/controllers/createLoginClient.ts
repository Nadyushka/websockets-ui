import {ClientMessageType, type LoginCreateType as ClientLoginCreateType} from "../types/ClientMessageType";
import type {WebSocket} from "ws";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {UsersDb} from "../db/users.db";
import {type LoginCreateType} from "../types/ServerMessageType";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";

const usersDb = UsersDb.getInstance()

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

    let result: LoginCreateType | {} = {}

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
}
