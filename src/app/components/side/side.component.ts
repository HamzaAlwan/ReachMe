import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { TokenService } from "../../services/token.service";

import io from "socket.io-client";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-side",
  templateUrl: "./side.component.html",
  styleUrls: ["./side.component.scss"]
})
export class SideComponent implements OnInit {
  sideComponents = [
    { name: "Home", link: "/home", icon: "public" },
    { name: "People", link: "/people", icon: "people" },
    { name: "Following", link: "/people/following", icon: "how_to_reg" },
    { name: "Followers", link: "/people/followers", icon: "camera_front" },
    { name: "Profile", link: "/profile", icon: "account_box" },
    { name: "Notifications", link: "/notifications", icon: "notifications" }
  ];

  socket: any;
  currentUser: any;

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.currentUser = this.tokenService.getPayload();
    this.getCurrentUser();
    this.socket.on("refreshPage", () => {
      this.getCurrentUser();
    });
  }

  getCurrentUser() {
    this.usersService.getUserById(this.currentUser._id).subscribe(
      data => {
        this.currentUser = data.user;
      },
      err => console.log(err)
    );
  }
}
