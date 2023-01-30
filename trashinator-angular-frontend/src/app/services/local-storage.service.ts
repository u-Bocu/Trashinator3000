import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public saveData(value: string): void {
    sessionStorage.setItem('username', value);
  }

  public deleteData(): void {
    sessionStorage.clear();
  }

  public getData(): string {
    return sessionStorage.getItem('username') as string;
  }

  public isLogged(): boolean {
    return !!sessionStorage.getItem('username');
  }
}
