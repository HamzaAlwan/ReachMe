import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class MessagesService {
  constructor(private http: HttpClient) {}

  sendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    return this.http.post(
      `${environment.api}/message/send/${senderId}/${receiverId}`,
      { receiverName, message }
    );
  }

  getMessages(senderId, receiverId): Observable<any> {
    return this.http.get(
      `${environment.api}/message/get/${senderId}/${receiverId}`
    );
  }

  markMessage(sender, receiver): Observable<any> {
    return this.http.get(
      `${environment.api}/message/mark/${sender}/${receiver}`
    );
  }

  markAllMessages(): Observable<any> {
    return this.http.get(`${environment.api}/message/mark-all`);
  }
}
