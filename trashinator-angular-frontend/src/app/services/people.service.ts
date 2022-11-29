import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  rootURL = 'http://localhost:8080/api';

  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  getPeople() {
    return this.http.get(
      this.rootURL + '/people',
      { headers: this.headers }
    ).pipe( map(res => res), catchError(err => throwError(err)) );
  }
}
