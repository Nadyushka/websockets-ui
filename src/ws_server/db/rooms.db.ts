import { RoomModel } from "../models/RoomModel";

export class RoomsDb {
    public static instance: RoomsDb;

    public static getInstance() {
        if (!RoomsDb.instance) {
            RoomsDb.instance = new RoomsDb();
        }
        return RoomsDb.instance;
    }

    private rooms: RoomModel[] = []

    getRooms() {
        return this.rooms
    }

    getRoom(indexRoom: string | number):RoomModel  {
        return this.rooms.find(room => room.roomId === indexRoom)!
    }

    /**
     *  Create new room
     */
    createRoom(): string {
        const roomId = new Date().getTime().toString()
        const newRoom = {
            roomId,
            roomUsers: []
        }

        this.rooms.push(newRoom)

        return roomId
    }

    deleteRoom(clientOneIndex: number | string, clientTwoIndex: number | string) {
        this.rooms = this.rooms.filter(room => {
            const roomUsersIndex = room.roomUsers.map(user => user.index)
            return !(roomUsersIndex.includes(clientOneIndex) && roomUsersIndex.includes(clientTwoIndex))
        })
    }

    /**
     * Send only rooms with 1 player
     */
    updateRooms(): RoomModel[] {
        return [...this.rooms.filter(room => room.roomUsers.length === 1 )]
    }

    /**
     * Add another to room
     */
    addUserToRoom(userName: string, index: string | number, indexRoom: string | number) {
        const userInRoom = {
            name: userName,
            index
        }

        this.rooms = this.rooms.map(room => {
            if (room.roomId == indexRoom) {
                return {
                    roomId: indexRoom,
                    roomUsers: [...room.roomUsers, userInRoom]
                }
            } else {
                return room
            }
        } )
    }
}
