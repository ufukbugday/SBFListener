import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: any): void {
    window.sessionStorage.removeItem(environment.USER_KEY);
    window.sessionStorage.setItem(environment.USER_KEY, JSON.stringify(token));
  }

  public getToken(): any {
    const user = window.sessionStorage.getItem(environment.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(environment.USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
