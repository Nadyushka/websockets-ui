import {createRoom} from "./createRoom";
import {addClientToRoom} from "./addClientToRoom";
import {UsersDb} from "../db/users.db";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {RoomsDb} from "../db/rooms.db";
import {createGame} from "./createGame";
import {BOT_INDEX} from "../constants";

const usersDb = UsersDb.getInstance()
const roomsDb = RoomsDb.getInstance()

export const singleMode = (clientIndex: string) => {
    // create room
    createRoom(clientIndex)

    // add to room bot
    const rooms = roomsDb.getRooms()
    const room = rooms.find(room => room.roomUsers.length == 1 && room.roomUsers.map(user => user.index).includes(clientIndex))
    const roomId = room!.roomId

    const userBot = usersDb.getUser(BOT_INDEX)

    addClientToRoom(
        {
            id: 0,
            type: MessageTypeEnum.AddUserToRoom,
            data: {
                indexRoom: roomId
            }
        },
         userBot.index as string
    )

    // create game
    createGame(roomId)
}
