import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs";
import { environment } from "../environnement";

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {

  constructor(private http: HttpClient) { }

  public getWorldStatistics(country_name: string): Observable<any> {
    return this.http.get(
      environment.API_URL + '/global_data/world_data?countryName=' + country_name,
      { headers: environment.HEADERS }
    )
  }

  public getListOfCountry(): Observable<any> {
    return this.http.get(
      environment.API_URL + '/global_data/country_name',
      { headers: environment.HEADERS }
    )
  }
}
