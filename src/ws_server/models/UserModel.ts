export class UserModel {
    name: string
    password: string
    index: string | number

    constructor(obj: Partial<UserModel>) {
        Object.assign(this, obj)
    }
}
