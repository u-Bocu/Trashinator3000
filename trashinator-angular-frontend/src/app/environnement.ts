import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,
  API_URL: 'http://localhost:8080/api',
  HEADERS: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
};
