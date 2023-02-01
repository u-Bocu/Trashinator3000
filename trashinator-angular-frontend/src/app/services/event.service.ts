import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private event = new EventEmitter<any>();

  emitRefreshNavigationEvent() {
    this.event.emit();
  }

  getRefreshNavigationEvent() {
    return this.event;
  }
}
