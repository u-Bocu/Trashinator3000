import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScansService {

  rootURL = 'http://localhost:8080/api';
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) { }

  public postScan(filePath: string[] | ArrayBuffer[] | null, user_id : string): Observable<any> {
    return this.http.post(
      this.rootURL + '/scans',
      {filePath: filePath, user_id},
      {headers: this.headers},
    );
  }

  public getScans(lastWeek: string = ''): Observable<any> {
    return this.http.get(
      this.rootURL + '/scans?last_week=' + lastWeek,
      { headers: this.headers }
    );
  }

  public getNbScansByPrediction(): Observable<any> {
    return this.http.get(
      this.rootURL + '/scans/predictions/count',
      { headers: this.headers }
    );
  }

  public getNbScansByDay(lastWeek: string = ''): Observable<any> {
    return this.http.get(
      this.rootURL + '/scans/count?last_week=' + lastWeek,
      { headers: this.headers }
    );
  }

  public getPoints(user_id: number): Observable<any> {
    return this.http.post(
      this.rootURL + '/scans/points',
      { user_id },
      { headers: this.headers }
    );
  }
}
