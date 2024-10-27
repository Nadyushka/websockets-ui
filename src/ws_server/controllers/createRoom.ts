import {RoomsDb} from "../db/rooms.db";
import {updateRooms} from "./updateRooms";
import {UsersDb} from "../db/users.db";

const roomsDb = RoomsDb.getInstance()
const usersDb = UsersDb.getInstance()

export const createRoom = (clientIndex: string) => {
    const { name, index} = usersDb.getUser(clientIndex)

    const roomId = roomsDb.createRoom()
    roomsDb.addUserToRoom(name, index, roomId)

    updateRooms()
}
