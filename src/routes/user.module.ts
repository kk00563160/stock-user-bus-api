import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from '@nestjs/axios'
import { UserController } from "./user.controller";
import { HttpClient } from "../infrastructure/client/http.client";
import CreateUserInfo from "../core-domain/user-service/createuserinfo.service";
import GetUserByUserId from "src/core-domain/user-service/getuserbyuserid.service";
import LogoutUserInfo from "src/core-domain/user-service/logoutuserinfo.service";


@Module({
    imports: [HttpModule],
    controllers: [UserController],
    providers: [CreateUserInfo, GetUserByUserId, LogoutUserInfo, HttpClient],
})
export class UserModule {
    constructor() {
        console.log('User Module Created')
    }
}