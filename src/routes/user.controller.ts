import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { GetUserModel } from "src/core-domain/models/getuser.model";
import { UserLogoutModel } from "src/core-domain/models/user.logout.model";
import { LoginStatus, UserModel } from "src/core-domain/models/user.model";
import GetUserByUserId from "src/core-domain/user-service/getuserbyuserid.service";
import LogoutUserInfo from "src/core-domain/user-service/logoutuserinfo.service";
import CreateUserInfo from "../core-domain/user-service/createuserinfo.service";


@Controller()
export class UserController {
    constructor(
        private getUser: GetUserByUserId,
        private userInfo: CreateUserInfo,
        private logoutUserInfo: LogoutUserInfo
    ) {
        console.log('User service controller')
    }

    @Get('/all/:userId')
    getUserByUserId(@Param('userId') userId: string, @Body() getUserModel: GetUserModel): Promise<UserModel[]> {
        getUserModel.userId = userId;
        return this.getUser.handle(getUserModel);
    }

    @Post('/login')
    createUserInfo(@Body() userModel: UserModel): Promise<LoginStatus> {
        const loginStatus = this.userInfo.handle(userModel);
        return loginStatus;
    }

    @Post('/logout')
    logoutInfo(@Body() userLogoutModel: UserLogoutModel):Promise<UserLogoutModel> {
        const user = this.logoutUserInfo.handle(userLogoutModel)
        return user;
    }
}


