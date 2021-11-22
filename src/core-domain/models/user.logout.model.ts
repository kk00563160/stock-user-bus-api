export class UserLogoutModel {
    constructor(public userId: string, public browser: string, public machineId: string,
        public shopId: number, public loginDate: Date, public logoutDate: Date) { }
}


// export class LoginStatus {
//     constructor(public status: string, public response: UserModel) { }
// }