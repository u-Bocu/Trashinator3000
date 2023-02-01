import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private navigationEvent = new EventEmitter<any>();
  private dashboardEvent = new EventEmitter<any>();

  emitRefreshNavigationEvent() {
    this.navigationEvent.emit();
  }
  emitRefreshDashboardEvent() {
    this.dashboardEvent.emit();
  }

  getRefreshNavigationEvent() {
    return this.navigationEvent;
  }
  getRefreshDashboardEvent() {
    return this.dashboardEvent;
  }
}
