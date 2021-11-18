import { Injectable } from "@nestjs/common";
import { HttpClient } from "../../infrastructure/client/http.client";
import { UserLogoutModel } from "../models/user.logout.model";
import { IBaseService } from "./base.service";

@Injectable()
export default class LogoutUserInfo implements IBaseService<UserLogoutModel, UserLogoutModel>{
    constructor(private httpclient: HttpClient) {
        console.log('LogoutUserInfo created')
    }

    async handle(userLogoutModel: UserLogoutModel): Promise<UserLogoutModel> {
        let date: Date = new Date();
        if (userLogoutModel.userLogout === 'logout') {
            userLogoutModel.logoutDate = date;
        }
        const responseObject = await this.httpclient.post('logout', userLogoutModel);

        return responseObject;
    }
}