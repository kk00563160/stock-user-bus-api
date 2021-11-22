import { HttpService } from "@nestjs/axios";
import { AxiosRequestConfig } from "axios";
import { ConfigService } from "../configuration/config.service";
import { UserSettingConstants } from "../constants/user-setting";
import { Injectable } from "@nestjs/common";
import { map, lastValueFrom } from "rxjs";




@Injectable()
export class HttpClient {

  constructor(private httpService: HttpService) {
    console.log("Httpclient object created")
  }

  public async post(url: string, data: any) {

    let responsedata: any
    var baseUrl = ConfigService.create().getBaseURl(UserSettingConstants.MASTER_BASE_URL)

    console.log("URl :", baseUrl + url)
    var env = ConfigService.create().isProduction();
    if (env) {

      console.log("Enter into production Block")
      const tokenObservable = this.getIdentityToken(baseUrl);
      console.log(tokenObservable)
      var token = await (await lastValueFrom(tokenObservable)).data;
      
        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }

        responsedata = await lastValueFrom(this.httpService.post(baseUrl + url, data, requestConfig));


    } else {
      console.log("Enter into Dev Block", baseUrl + url)
      responsedata = await lastValueFrom(this.httpService.post(baseUrl + url, data));
    }
    console.log(responsedata.data)
    return responsedata.data;
  }

  public async patch(url: string, data: any) {

    let responsedata: any
    var baseUrl = ConfigService.create().getBaseURl(UserSettingConstants.MASTER_BASE_URL)

    console.log("URl :", baseUrl + url)
    var env = ConfigService.create().isProduction();
    if (env) {

      console.log("Enter into production Block")
      const tokenObservable = this.getIdentityToken(baseUrl);
      console.log(tokenObservable)
      await tokenObservable.subscribe(response => {
        var token = response.data;
        console.log("token :", token)

        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }

        responsedata = this.httpService.patch(baseUrl + url, data).pipe(map(resp => (resp.data)));

      });
    } else {
      console.log("Enter into Dev Block")
      responsedata = this.httpService.patch(baseUrl + url, data).pipe(map(resp => (resp.data)));
    }
    console.log(responsedata)
    return responsedata;
  }

  public async get(url: string, data: any) {

    let responsedata: any
    var baseUrl = ConfigService.create().getBaseURl(UserSettingConstants.MASTER_BASE_URL)

    console.log("URl :", baseUrl + url)
    var env = ConfigService.create().isProduction();
    if (env) {

      console.log("Enter into production Block")
      const tokenObservable = this.getIdentityToken(baseUrl);
      console.log(tokenObservable)
      await tokenObservable.subscribe(response => {
        var token = response.data;
        console.log("token :", token)

        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }

        responsedata = this.httpService.get(baseUrl + url, data).pipe(map(resp => (resp.data)));
      });
    } else {
      console.log("Enter into Dev Block")
      responsedata = this.httpService.get(baseUrl + url, data).pipe(map(resp => (resp.data)));
    }
    console.log(responsedata)
    return responsedata;
  }

  public async delete(url: string) {

    let responsedata: any
    var baseUrl = ConfigService.create().getBaseURl(UserSettingConstants.MASTER_BASE_URL)

    console.log("URl :", baseUrl + url)
    var env = ConfigService.create().isProduction();
    if (env) {

      console.log("Enter into production Block")
      const tokenObservable = this.getIdentityToken(baseUrl);
      console.log(tokenObservable)
      var token = await (await lastValueFrom(tokenObservable)).data;
      
        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }

        responsedata = await lastValueFrom(this.httpService.delete(baseUrl + url,requestConfig));


    } else {
      console.log("Enter into Dev Block", baseUrl + url)
      responsedata = await lastValueFrom(this.httpService.delete(baseUrl + url));
    }
    console.log(responsedata.data)
    return responsedata.data;
  }


  private getIdentityToken(recipientUrl) {
    /*if (
      process.env.GCP_IDENTITY_TOKEN &&
      isActive(process.env.GCP_IDENTITY_TOKEN)
    ) {
      return process.env.GCP_IDENTITY_TOKEN;
    }*/
    const requestConfig: AxiosRequestConfig = {
      params: {
        audience: recipientUrl,
      },
      headers: {
        'metadata-flavor': 'Google',
      }
    }
    return this.httpService.get(process.env.GCP_IDENTITY_TOKEN_URL, requestConfig);
  }

}