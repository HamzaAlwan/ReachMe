import { Component, OnInit } from "@angular/core";

import { UsersService } from "../../services/users.service";
import { TokenService } from "../../services/token.service";
import { NotificationsService } from "../../services/notifications.service";

import io from "socket.io-client";
import * as moment from "moment";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit {
  socket: any;
  currentUser: any;

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private notificationService: NotificationsService
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

  markRead(noti) {
    this.notificationService.markRead(noti._id).subscribe(data => {
      this.socket.emit("refresh", {});
    });
  }

  removeNoti(noti) {
    this.notificationService.deleteNoti(noti._id).subscribe(data => {
      this.socket.emit("refresh", {});
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
