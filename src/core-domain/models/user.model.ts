import { Timestamp } from "typeorm";

export class UserModel {
    constructor(public userId: string, public browser: string, public machineId: string,
        public shopId: number, public userLogin: string, public loginDate: Date) { }
}


export class LoginStatus {
    constructor(public status: string, public response: UserModel) { }
}
