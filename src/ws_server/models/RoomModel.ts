import {UserModel} from "./UserModel";

export class RoomModel {
    roomId: number | string
    roomUsers: Array<Pick<UserModel, "name" | "index">> = []

    constructor(obj: Partial<RoomModel>) {
        Object.assign(this, obj)
    }

}
