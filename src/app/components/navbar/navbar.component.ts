import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter
} from "@angular/core";
import { Router } from "@angular/router";

import { TokenService } from "../../services/token.service";
import { UsersService } from "../../services/users.service";
import { MessagesService } from "../../services/messages.service";
import { NotificationsService } from "../../services/notifications.service";

import io from "socket.io-client";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();

  token: any;
  socket: any;
  currentUser: any;
  notificationsCount: any;
  msgCount = 0;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private usersService: UsersService,
    private messagesService: MessagesService,
    private notificationService: NotificationsService,
    private snackBar: MatSnackBar
  ) {
    this.socket = io(environment.socket_io);
  }

  async ngOnInit() {
    this.currentUser = this.tokenService.getPayload();
    this.getCurrentUser();
    this.socket.on("refreshPage", () => {
      this.getCurrentUser();
    });

    this.socket.emit("online", {
      room: "global",
      user: this.currentUser.username
    });
  }

  ngAfterViewInit() {
    this.socket.on("usersOnline", data => {
      this.onlineUsers.emit(data);
    });
  }

  getCurrentUser() {
    this.usersService.getUserById(this.currentUser._id).subscribe(
      data => {
        this.currentUser = data.user;
        // Number of unread notifications
        this.notificationsCount = data.user.notifications.filter(
          elem => !elem.read
        ).length;
        this.checkIfRead(data.user.chatList);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
        }
        this.router.navigate([""]);
      }
    );
  }

  checkIfRead(arr) {
    let checkCount = 0;
    for (let i = 0; i < arr.length; i++) {
      const receiver =
        arr[i].messageId.message[arr[i].messageId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.senderName}`) {
        if (
          receiver.isRead === false &&
          receiver.receiverName === this.currentUser.username
        ) {
          checkCount++;
          this.msgCount = checkCount;
        }
      }
    }
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate([""]);
  }

  goToChatPage(name) {
    this.router.navigate(["chat", name]);
  }
  // Notifications
  markNotiRead(noti) {
    this.notificationService.markRead(noti._id).subscribe(data => {
      this.socket.emit("refresh", {});
    });
  }

  // Notifications
  markAllNoti() {
    this.notificationService.markAllRead().subscribe(data => {
      this.snackBar.open(data.message, "Close", {
        duration: 1000
      });
      this.socket.emit("refresh", {});
    });
  }

  markAllMessages() {
    this.messagesService.markAllMessages().subscribe(() => {
      this.msgCount = 0;
      this.snackBar.open("Done", "Close", {
        duration: 1000
      });
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

  messageDate(date) {
    return moment(date).calendar(null, {
      sameDay: `[${this.timeFromNow(date)}]`,
      lastDay: "[Yesterday]",
      lastWeek: "DD/MM/YYYY",
      sameElse: "DD/MM/YYYY"
    });
  }
}
