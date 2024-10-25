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

    /**
     *  Create new room
     */
    createRoom(): RoomModel[] {
        const roomId = new Date().getTime().toString()
        const newRoom = new RoomModel({
            roomId
        })

        this.rooms.push(newRoom)

        return this.rooms
    }

    /**
     * Send only rooms with 1 player
     */
    updateRooms(): RoomModel[] {
        return [...this.rooms.filter(room => room.roomUsers.length = 1 )]
    }

    /**
     * Add another user to room with 1 player and remove room from available
     */
    addUserToRoom(indexRoom: number) {
        this.rooms = this.rooms.filter(room => room.roomId !== indexRoom )
        return this.rooms
    }
}
