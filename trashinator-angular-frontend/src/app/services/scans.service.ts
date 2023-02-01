import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environnement";

@Injectable({
  providedIn: 'root'
})
export class ScansService {

  constructor(private http: HttpClient) { }

  public postScan(filePath: string[] | ArrayBuffer[] | null, user_id : string): Observable<any> {
    return this.http.post(
      environment.API_URL + '/scans',
      {filePath: filePath, user_id},
      {headers: environment.HEADERS},
    );
  }

  public getScans(lastWeek: string = ''): Observable<any> {
    return this.http.get(
      environment.API_URL + '/scans?last_week=' + lastWeek,
      { headers: environment.HEADERS }
    );
  }

  public getNbScansByPrediction(): Observable<any> {
    return this.http.get(
      environment.API_URL + '/scans/predictions/count',
      { headers: environment.HEADERS }
    );
  }

  public getNbScansByPredictionByUser(user_id?: number): Observable<any> {
    return this.http.post(
      environment.API_URL + '/scans/predictions/count',
      { user_id },
      { headers: environment.HEADERS }
    );
  }

  public getNbScansByDay(lastWeek: string = ''): Observable<any> {
    return this.http.get(
      environment.API_URL + '/scans/count?last_week=' + lastWeek,
      { headers: environment.HEADERS }
    );
  }

  public getNbScansByDayByUser(lastWeek: string = '', user_id: number): Observable<any> {
    return this.http.get(
      environment.API_URL + '/scans/count/user?last_week=' + lastWeek + '&user_id=' + user_id,
      { headers: environment.HEADERS }
    );
  }

  public getPoints(user_id: number): Observable<any> {
    return this.http.post(
      environment.API_URL + '/scans/points',
      { user_id },
      { headers: environment.HEADERS }
    );
  }
}
