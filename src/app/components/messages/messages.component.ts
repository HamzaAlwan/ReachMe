import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { TokenService } from "../../services/token.service";
import { MessagesService } from "../../services/messages.service";
import { UsersService } from "../../services/users.service";

import io from "socket.io-client";

import { environment } from "../../../environments/environment";
@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit, AfterViewInit {
  socket: any;
  messages: any;
  receiverName: any;
  receiver: any;
  currentUser: any;
  message: any;

  typingMessage;
  typing = false;
  isOnline;

  constructor(
    private tokenService: TokenService,
    private messagesService: MessagesService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.socket = io(environment.socket_io);
  }

  @ViewChild("chatDiv") chatDiv;

  // The ability to auto scroll after sending a message;
  scrollBottom() {
    this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
  }

  ngAfterViewInit() {
    const params = {
      room1: this.currentUser.username,
      room2: this.receiverName
    };

    this.socket.emit("join chat", params);

    this.socket.on("usersOnline", data => {
      const result = data.indexOf(this.receiverName);
      if (result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollBottom();
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.currentUser = this.tokenService.getPayload();
    this.route.params.subscribe(params => {
      this.receiverName = params.name;
      this.getUserByName(params.name);

      // Mark Messages as readW
      this.messagesService
        .markMessage(this.currentUser.username, params.name)
        .subscribe(data => {
          this.socket.emit("refresh", {});
        });

      this.socket.on("refreshPage", () => {
        this.getUserByName(this.receiver.username);
        this.getCurrentUser();
      });
    });

    this.socket.on("start_typing", data => {
      if (data.sender === this.receiverName) {
        this.typing = true;
      }
    });

    this.socket.on("stop_typing", data => {
      if (data.sender === this.receiverName) {
        this.typing = false;
      }
    });
  }

  getCurrentUser() {
    this.usersService.getUserById(this.currentUser._id).subscribe(data => {
      this.currentUser = data.user;
    });
  }

  getUserByName(username) {
    this.usersService.getUserByName(username).subscribe(data => {
      this.receiver = data.user;

      this.getMessages(this.currentUser._id, data.user._id);
    });
  }

  getMessages(senderId, receiverId) {
    this.messagesService.getMessages(senderId, receiverId).subscribe(res => {
      this.messages = res.messages.message;
    });
  }

  sendMessage(e = undefined) {
    if ((!e && this.message) || (e.keyCode == 13 && this.message)) {
      this.messagesService
        .sendMessage(
          this.currentUser._id,
          this.receiver._id,
          this.receiver.username,
          this.message
        )
        .subscribe(res => {
          this.socket.emit("refresh", {});
          this.message = "";
        });
    }
  }

  isTyping() {
    this.socket.emit("typing", {
      sender: this.currentUser.username,
      receiver: this.receiverName
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit("notTyping", {
        sender: this.currentUser.username,
        receiver: this.receiverName
      });
    }, 1000);
  }
}
