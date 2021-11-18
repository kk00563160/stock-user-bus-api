import { Injectable } from "@nestjs/common";
import { HttpClient } from "src/infrastructure/client/http.client";
import { GetUserModel } from "../models/getuser.model";
import { UserModel } from "../models/user.model";
import { IBaseService } from "./base.service";


@Injectable()
export default class GetUserByUserId implements IBaseService<GetUserModel, UserModel>{
    constructor(private httpclient: HttpClient) {
        console.log('UpdateLogoutInfo created')
    }


    async handle(getUserModel: GetUserModel): Promise<UserModel[]> {
        return await this.httpclient.get('all', getUserModel);
    }
}