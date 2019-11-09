import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { TokenService } from "../../services/token.service";

import { find } from "lodash";

import io from "socket.io-client";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-followers",
  templateUrl: "./followers.component.html",
  styleUrls: ["./followers.component.scss"]
})
export class FollowersComponent implements OnInit {
  socket: any;
  followers: any;
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
        this.followers = data.user.followers;
        this.currentUser = data.user;
        this.filterUsers();
      },
      err => console.log(err)
    );
  }

  filterUsers() {
    this.filteredUsers = this.followers;
    if (this.search.length > 0) {
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.follower.username.includes(this.search)
      );
    }
  }

  checkUserFollowing(arr, id) {
    const found = find(arr, ["follower", id]);
    return found ? true : false;
  }

  onFollow(user) {
    this.usersService.followUser(user._id).subscribe(res => {
      this.socket.emit("refresh", {});
    });
  }

  unFollow(user) {
    this.usersService.unFollowUser(user._id).subscribe(res => {
      this.socket.emit("refresh", {});
    });
  }
}
