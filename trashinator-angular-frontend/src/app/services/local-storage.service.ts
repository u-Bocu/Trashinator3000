import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public saveData(label: string, value: string): void {
    sessionStorage.setItem(label, value);
  }

  public deleteData(): void {
    sessionStorage.clear();
  }

  public getData(choice: string): string {
    switch (choice) {
      case 'username':
        return sessionStorage.getItem('username') as string;
      case 'user_id':
        return sessionStorage.getItem('user_id') as string;
      default:
        return '';
    }
  }

  public isLogged(): boolean {
    return !!sessionStorage.getItem('username');
  }
}
