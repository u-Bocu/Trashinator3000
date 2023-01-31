import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rootURL = 'http://localhost:8080/api';
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) { }

  // TO MOVE TO AUTH.services.ts
  public signup(username : string, password : string, mailAddress : string) : Observable<any> {
    return this.http.post(
      this.rootURL + '/auth/sign-up',
      { username : username , password : password, mail_address : mailAddress},
      {headers: this.headers}
    );
  }

  public login(username : string, password : string) : Observable<any>
  {
    return this.http.post(
      this.rootURL + '/auth/login',
      { username : username, password : password},
      {headers : this.headers}
    );
  }

  public forgotPassword(mailAddress : string) : Observable<any>
  {
    return this.http.post(
      this.rootURL + '/auth/forgotpassword',
      { mail_address : mailAddress },
      {headers : this.headers}
    );
  }

  public resetPassword(token : string, password : string) : Observable<any>
{
  return this.http.post(
    this.rootURL + '/auth/resetpassword',
    { token : token, password : password },
    {headers : this.headers}
  );
}
}



















