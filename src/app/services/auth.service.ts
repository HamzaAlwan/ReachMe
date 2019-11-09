import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(user): Observable<any> {
    return this.http.post(`${environment.api}/register`, user);
  }

  loginUser(user): Observable<any> {
    return this.http.post(`${environment.api}/login`, user);
  }

  // Convert the date for the forms
  formatDate(inputDate) {
    function pad(s) {
      return s < 10 ? '0' + s : s;
    }
    const d = new Date(inputDate);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }
}
