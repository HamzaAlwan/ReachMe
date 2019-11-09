import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { TokenService } from "../../services/token.service";

import io from "socket.io-client";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-following",
  templateUrl: "./following.component.html",
  styleUrls: ["./following.component.scss"]
})
export class FollowingComponent implements OnInit {
  socket: any;
  following: any;
  currentUser: any;
  search: any = "";
  filteredUsers: any;

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
        this.following = data.user.following;
        this.currentUser = data.user;
        this.filterUsers();
      },
      err => console.log(err)
    );
  }

  filterUsers() {
    this.filteredUsers = this.following;
    if (this.search.length > 0) {
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.followed.username.includes(this.search)
      );
    }
  }

  unFollow(user) {
    this.usersService.unFollowUser(user._id).subscribe(res => {
      this.socket.emit("refresh", {});
    });
  }
}
