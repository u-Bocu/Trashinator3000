import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";

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
  public Signup(username : string, password : string, mailAdress : string) : Observable<any> {
    return this.http.post(
      this.rootURL + '/auth/sign-up',
      { username : username , password : password, mailAdress : mailAdress},
      {headers: this.headers}
    );
  }

  public Login(username : string, password : string) : Observable<any> 
  {
    return this.http.post(
      this.rootURL + '/auth/login',
      { username : username, password : password},
      {headers : this.headers}
    );
  }

  public forgotPassword(mailAdress : string) : Observable<any>
  {
    return this.http.post(
      this.rootURL + '/auth/forgotpassword',
      { mailAdress : mailAdress },
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



















