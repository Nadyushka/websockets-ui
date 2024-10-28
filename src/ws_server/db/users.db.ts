import {UserModel} from "../models/UserModel";
import {type LoginCreateType} from "../types/ServerMessageType";
import { type LoginCreateType as ClientLoginCreateType} from "../types/ClientMessageType";

export class UsersDb {
    public static instance: UsersDb;

    public static getInstance() {
        if (!UsersDb.instance) {
            UsersDb.instance = new UsersDb();
        }
        return UsersDb.instance;
    }

    private users:UserModel[] = []

    getUsers ():UserModel[] {
        return this.users;
    }

    getUser(index: string | number):UserModel {
        return this.users.find(user => user.index === index)!
    }

    ifUserExistByNameCheck (name: string):boolean {
        return this.users.findIndex(user => user.name === name) > 0
    }

    createUser (userData: ClientLoginCreateType): LoginCreateType {
        const newUser = new UserModel({
            ...userData,
            index: userData.clientIndex,
        })

        this.users.push(newUser)

        return {
            name: newUser.name,
            index: newUser.index,
            errorText: "",
            error: false
        }
    }

    loginUser (userData: ClientLoginCreateType): LoginCreateType {
        const userInDB = this.users.find(user => user.name === userData.name)!
        if (userInDB.password !== userData.password) {
            return {
                name: userInDB.name,
                index: '',
                errorText: "Incorrect password",
                error: true
            }
        }

        return {
            name: userInDB.name,
            index: userInDB.index,
            errorText: "",
            error: false
        }
    }
}

