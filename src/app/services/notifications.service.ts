import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class NotificationsService {
  constructor(private http: HttpClient) {}
  // A service to mark a specific notification as read
  markRead(id): Observable<any> {
    return this.http.post(`${environment.api}/notifications/mark`, { id });
  }
  // A service to mark a specific notification as read
  markAllRead(): Observable<any> {
    return this.http.post(`${environment.api}/notifications/mark-all`, {});
  }

  // A service to delete a specific notification
  deleteNoti(id): Observable<any> {
    return this.http.post(`${environment.api}/notifications/delete`, { id });
  }
}
