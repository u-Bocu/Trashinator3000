import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NbScansChartService {

  constructor() { }

  getData() {
    return [120, 180, 150, 80, 70, 110, 130];
  }
}
