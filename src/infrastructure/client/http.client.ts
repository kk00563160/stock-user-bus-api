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
      console.log('tokenObservable',tokenObservable)
      var token = tokenObservable;

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
    console.log('responsedata',responsedata.data)
    return responsedata.data;
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

      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Authorization': `Bearer ${tokenObservable}`,
        }
      }


      responsedata = await lastValueFrom(this.httpService.get(baseUrl + url, requestConfig));


    } else {
      console.log("Enter into Dev Block")
      responsedata = await lastValueFrom(this.httpService.get(baseUrl + url));
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
      var token = await (tokenObservable);

      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }

      responsedata = await lastValueFrom(this.httpService.delete(baseUrl + url, requestConfig));


    } else {
      console.log("Enter into Dev Block", baseUrl + url)
      responsedata = await lastValueFrom(this.httpService.delete(baseUrl + url));
    }
    console.log(responsedata.data)
    return responsedata.data;
  }

  private isActive(jwt: any) {
    const milliseconds = 1000;

    const payload = jwt.split('.')[1];
    const jsonPayload = Buffer.from(payload, 'base64').toString('utf-8');
    const { exp } = JSON.parse(jsonPayload);
    const now = Math.ceil(new Date().getTime() / milliseconds);

    return now < exp;
  };

  private getIdentityToken(recipientUrl) {
    if (
      process.env.GCP_IDENTITY_TOKEN &&
      this.isActive(process.env.GCP_IDENTITY_TOKEN)
    ) {
      return process.env.GCP_IDENTITY_TOKEN;
    }
    const requestConfig: AxiosRequestConfig = {
      params: {
        audience: recipientUrl,
      },
      headers: {
        'metadata-flavor': 'Google',
      }
    }
    console.log('recipientUrl',recipientUrl)
    const data = await lastValueFrom(this.httpService.get(process.env.GCP_IDENTITY_TOKEN_URL, requestConfig));

    process.env.GCP_IDENTITY_TOKEN = data.data

    console.log('process.env.GCP_IDENTITY_TOKEN',process.env.GCP_IDENTITY_TOKEN)

    return data.data

  }

}
