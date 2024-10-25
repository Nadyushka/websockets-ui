export class UserModel {
    name: string
    password: string
    index: string

    constructor(obj: Partial<UserModel>) {
        Object.assign(this, obj)
    }
}
