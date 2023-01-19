import { ConfigService } from './../config/config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { AuthRequest } from 'src/app/models/auth/auth-request.model';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.apiUrl;

  constructor(public http: HttpClient, public configService: ConfigService) { }

  authorize(model: AuthRequest): Observable<any> {
    const url = `${this.baseUrl}/Authorize`
    return this.http.post<AuthRequest>(url, model)
    .pipe(
      catchError(this.configService.handleError)
    );
  }


}
