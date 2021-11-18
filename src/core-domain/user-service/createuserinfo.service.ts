import { Injectable } from "@nestjs/common";
import { HttpClient } from "../../infrastructure/client/http.client";
import { LoginStatus, UserModel } from "../models/user.model";
import { IBaseService } from "./base.service";

@Injectable()
export default class CreateUserInfo implements IBaseService<UserModel, LoginStatus>{
    constructor(private httpclient: HttpClient) {
        console.log('UpdateUserInfo created')
    }

    async handle(userModel: UserModel): Promise<LoginStatus> {
        let date: Date = new Date();
        if (userModel.userLogin === 'login') {
            userModel.loginDate = date;
        }
        const responseObject = await this.httpclient.post('getUserInfo', userModel);

         console.log("response obj",responseObject)

         console.log("Model",userModel)

        if (responseObject.length === 0) {
            console.log("New User")
            const users = await this.httpclient.post('save', userModel);
            console.log("New User logged in",users)
            const um = new UserModel(users.userId, users.browser, users.machineId, users.shopId, users.userLogin, users.loginDate)
            const loginStatus = new LoginStatus("SUCCESS", um)
            return loginStatus;
        }

        else {
            for (let obj of responseObject) {
                if (obj.userId === userModel.userId) {
                    if (obj.browser === userModel.browser && obj.machineId === userModel.machineId) {
                        const loginStatus = new LoginStatus("SUCCESS", obj)
                        return loginStatus
                    }
                    return new LoginStatus("LOGGED_OUT", obj)
                }
            }
        }

        return responseObject;
    }
}