import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${environment.api}/user/getAll`);
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${environment.api}/user/getById/${id}`);
  }

  getUserByName(username): Observable<any> {
    return this.http.get(`${environment.api}/user/getByName/${username}`);
  }

  followUser(userId): Observable<any> {
    return this.http.post(`${environment.api}/user/follow`, {
      userId
    });
  }

  unFollowUser(userId): Observable<any> {
    return this.http.post(`${environment.api}/user/unfollow`, {
      userId
    });
  }

  updateProfile(userData): Observable<any> {
    return this.http.post(`${environment.api}/update-profile`, userData);
  }

  updatePassword(userData): Observable<any> {
    return this.http.post(`${environment.api}/update-password`, userData);
  }
}
