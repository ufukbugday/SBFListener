import { StorageService } from 'src/app/services/storage.service';
import { ConfigService } from './config.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { AuthRequest } from 'src/app/models/auth/auth-request.model';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private configService: ConfigService, private storageService: StorageService) { }

  authorize(model: AuthRequest): Observable<any> {
    const url = `${this.baseUrl}/Authorize`
    return this.http.post<AuthRequest>(url, model)
      .pipe(
        catchError(this.configService.handleError)
      );
  }

  getGreeting(): Observable<any> {
    var token = this.storageService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({ 'x-user-token': token })
    };
    const url = `${this.baseUrl}/GetGreeting`
    return this.http.get<AuthRequest>(url, httpOptions)
      .pipe(
        catchError(this.configService.handleError)
      );
  }

}
