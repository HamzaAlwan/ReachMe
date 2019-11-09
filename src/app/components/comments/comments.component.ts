import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";

import io from "socket.io-client";
import * as moment from "moment";
import { some } from "lodash";

import { PostsService } from "../../services/posts.service";
import { TokenService } from "../../services/token.service";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit {
  socket: any;
  username: any;
  commentForm: FormGroup;
  post: any;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CommentsComponent>,
    @Inject(MAT_DIALOG_DATA) private matData: any
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.username = this.tokenService.getPayload().username;

    this.post = this.matData.post;
    this.commentForm = this.fb.group({
      comment: [""],
      postId: [""]
    });

    // Detect event and update the current post
    this.socket.on("refreshPage", () => {
      this.getPost();
    });
  }

  getPost() {
    this.postsService.getPost(this.post._id).subscribe(data => {
      this.post = data.post;
    });
  }

  addComment() {
    this.commentForm.value.postId = this.post._id;
    this.postsService.addComment(this.commentForm.value).subscribe(data => {
      this.socket.emit("refresh", {});
      this.commentForm.reset();
    });
  }

  onLike(post) {
    this.postsService.likePost(post).subscribe(
      data => {
        this.socket.emit("refresh", {});
      },
      err => {
        this.snackBar.open(err, "Close", {
          duration: 3000
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

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  close() {
    this.dialogRef.close();
  }
}
