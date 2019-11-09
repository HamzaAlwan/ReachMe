import { Component, OnInit } from "@angular/core";

import io from "socket.io-client";
import { remove, find } from "lodash";

import { UsersService } from "../../services/users.service";
import { TokenService } from "../../services/token.service";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.scss"]
})
export class PeopleComponent implements OnInit {
  socket: any;
  currentUser: any;
  allUsers: any[];
  search: String = "";
  filteredUsers: any;

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.currentUser = this.tokenService.getPayload();
    this.getUsers();

    this.socket.on("refreshPage", () => {
      this.getUsers();
      this.getCurrentUser();
    });
  }

  getUsers() {
    this.usersService.getUsers().subscribe(data => {
      remove(data.users, { _id: this.currentUser._id });
      this.allUsers = data.users;
      this.filterUsers();
    });
  }

  filterUsers() {
    this.filteredUsers = this.allUsers;
    if (this.search.length > 0) {
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.username.includes(this.search)
      );
    }
  }

  getCurrentUser() {
    this.usersService.getUserById(this.currentUser._id).subscribe(data => {
      this.currentUser = data.user;
    });
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

  checkUserFollowing(arr, id) {
    const found = find(arr, ["follower._id", id]);
    return found ? true : false;
  }
}
