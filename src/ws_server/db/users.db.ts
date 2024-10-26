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

    ifUserExistByNameCheck (name: string):boolean {
        console.log(this.users.findIndex(user => user.name === name))
        return this.users.findIndex(user => user.name === name) > 0
    }

    createUser (userData: ClientLoginCreateType): LoginCreateType {
        const userIndex =  new Date().getTime().toString()
        const newUser = new UserModel({
            ...userData,
            index: userIndex,
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

