import type {AddUserToRoomType, ClientMessageType} from "../types/ClientMessageType";
import {updateRooms} from "./updateRooms";
import {createGame} from "./createGame";
import {RoomsDb} from "../db/rooms.db";
import {UsersDb} from "../db/users.db";

const roomsDb = RoomsDb.getInstance();
const usersDb = UsersDb.getInstance()

export const addClientToRoom = (clientMessage: ClientMessageType<AddUserToRoomType>, clientIndex: string) => {
    const { name, index} = usersDb.getUser(clientIndex)

    const indexRoom = clientMessage.data.indexRoom
    roomsDb.addUserToRoom(name, index, indexRoom)

    updateRooms()
    createGame(indexRoom)
}
