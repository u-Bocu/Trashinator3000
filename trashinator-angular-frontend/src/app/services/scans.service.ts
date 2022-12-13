import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScansService {

  rootURL = 'http://localhost:8080/api';
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) { }

  public getNbScansByDay(): Array<any> {
    return [120, 180, 150, 80, 70, 110, 130];
  }

  public getScans(): Observable<any> {
    return this.http.get(
      this.rootURL + '/scans',
      { headers: this.headers }
    ).pipe( map(res => res), catchError(err => throwError(err)) );
  }

  public getNbScansByPrediction(): Observable<any> {
    return this.http.get(
      this.rootURL + '/scans/predictions/count',
      { headers: this.headers }
    ).pipe( map(res => res), catchError(err => throwError(err)) );
  }
}
