import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar, MatDialog, MatDialogConfig } from "@angular/material";

import io from "socket.io-client";
import { some } from "lodash";

import { PostsService } from "../../services/posts.service";
import { TokenService } from "../../services/token.service";
import { CommentsComponent } from "../comments/comments.component";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss"]
})
export class PostsComponent implements OnInit {
  socket: any;
  posts: any[] = [];
  username: string;

  constructor(
    private postsService: PostsService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.username = this.tokenService.getPayload().username;
    this.getAllPosts();

    // Listen for posts changes
    this.socket.on("refreshPage", () => {
      this.getAllPosts();
    });
  }

  trackByFn(index, item) {
    return index;
  }

  getAllPosts() {
    this.postsService.getPosts().subscribe(data => {
      this.posts = data.posts;
    });
  }

  onLike(post) {
    this.postsService.likePost(post).subscribe(
      data => {
        this.socket.emit("refresh", {});
      },
      err => {
        this.snackBar.open(err, "Close", {
          duration: 2000
        });
      }
    );
  }

  onUnLike(post) {
    this.postsService.unLikePost(post).subscribe(
      data => {
        this.socket.emit("refresh", {});
      },
      err => {
        this.snackBar.open(err, "Close", {
          duration: 2000
        });
      }
    );
  }

  checkUserLikes(arr) {
    return some(arr, { username: this.username });
  }

  checkUserComments(arr) {
    return some(arr, { username: this.username });
  }

  onCommentDialogOpen(post) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "65%";
    dialogConfig.data = {
      post
    };
    this.dialog.open(CommentsComponent, dialogConfig);
  }
}
