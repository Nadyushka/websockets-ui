import {ConnectionsDb} from "../db/connections.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {RoomsDb} from "../db/rooms.db";

const connectionDb = ConnectionsDb.getInstance()
const roomsDb = RoomsDb.getInstance()

export const updateRooms = () => {
    const availableRooms = roomsDb.updateRooms()
    const connection = connectionDb.getConnections()

    const message = prepareJsonResponse(
        MessageTypeEnum.UpdateRoom,
        JSON.stringify(availableRooms)
    )

    connection.forEach(connection => {
        connection.ws.send(message)
    })
}
