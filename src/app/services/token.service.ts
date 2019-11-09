import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class TokenService {
  constructor(private cookieService: CookieService) {}

  setToken(token) {
    this.deleteToken();
    this.cookieService.set("Token", token);
  }

  getToken() {
    return this.cookieService.get("Token");
  }

  deleteToken() {
    this.cookieService.delete("Token");
  }

  getPayload() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = JSON.parse(window.atob(payload));
    }
    return payload;
  }
}
