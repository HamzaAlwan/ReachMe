import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { TokenService } from "./services/token.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  auth_route: Boolean = true;

  constructor(private router: Router, private tokenService: TokenService) {
    // Detect current route
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        let body = document.body;
        if (val.url === "/") {
          // Add background
          body.classList.add("auth_background");
          this.auth_route = true;
        } else {
          // Remove background
          body.classList.remove("auth_background");
          this.auth_route = false;
        }
      }
    });
  }

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(["home"]);
    } else {
      this.router.navigate([""]);
    }
  }
}
