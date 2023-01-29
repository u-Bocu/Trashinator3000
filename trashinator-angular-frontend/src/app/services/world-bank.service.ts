import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {

  rootURL = 'http://localhost:8080/api';
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) { }

  public getWorldStatistics(country_name: string): Observable<any> {
    return this.http.get(
      this.rootURL + '/global_data/world_data?countryName=' + country_name,
      { headers: this.headers }
    )
  }

  public getListOfCountry(): Observable<any> {
    return this.http.get(
      this.rootURL + '/global_data/country_name',
      { headers: this.headers }
    )
  }
}
