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
    console.log('Date Login', date)
    userLogoutModel.logoutDate = date;
    

    console.log('*************************',userLogoutModel)
   const found = await this.httpclient.post('getUserInfo', userLogoutModel);
 
    console.log('Found',found)

    for (let obj of await found) {
        console.log('Inside for for loop')
        console.log('UserModel**(((', userLogoutModel.userId,userLogoutModel.browser, userLogoutModel.machineId,userLogoutModel.shopId)
        console.log('%%%%%%%%%BJ',obj)
        console.log('%-----', obj.userId, obj.browser,obj.machineId, obj.shopId )
                if (obj.userId === userLogoutModel.userId && obj.browser === userLogoutModel.browser && 
                    obj.machineId === userLogoutModel.machineId /*&& obj.shopId==userLogoutModel.shopId*/) {
                    console.log('inside if block logout')

                    userLogoutModel.loginDate = obj.loginDate;
  //  const users= new UserLogoutModel(userLogoutModel.userId, userLogoutModel.browser, userLogoutModel.machineId,
    //    userLogoutModel.shopId, obj.loginDate, userLogoutModel.logoutDate);
   
    console.log('User&&&')
    const res = await this.httpclient.post('logout', userLogoutModel)
   
    console.log('Res++++', res)

    const delres = await this.httpclient.delete('delUserInfo/'+userLogoutModel.userId+"/"+ userLogoutModel.shopId);
   
    console.log('delRes++++', delres)

    return res;
}

}

}

}