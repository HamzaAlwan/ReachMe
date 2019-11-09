import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar } from "@angular/material";

import io from "socket.io-client";

import { PostsService } from "../../services/posts.service";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-post-form",
  templateUrl: "./post-form.component.html",
  styleUrls: ["./post-form.component.scss"]
})
export class PostFormComponent implements OnInit {
  @ViewChild("myPond") myPond: any;

  socket: any;
  postForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PostFormComponent>,
    private snackBar: MatSnackBar,
    private postsService: PostsService,
    private fb: FormBuilder
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.postForm = this.fb.group({
      image: "",
      post: ["", [Validators.required]]
    });
  }

  createPost() {
    this.postsService.createPost(this.postForm.value).subscribe(
      data => {
        this.socket.emit("refresh", {});
        this.dialogRef.close();
        this.postForm.reset();
      },
      err => {
        if (err.error.messageJoi) {
          this.snackBar.open(err.error.messageJoi[0].message, "Close", {
            duration: 2000
          });
        } else if (err.error.message) {
          this.snackBar.open(err.error.message, "Close", {
            duration: 2000
          });
        } else {
          this.snackBar.open("Internal server error", "Close", {
            duration: 2000
          });
        }
      }
    );
  }

  handleAddFile() {
    const file = this.myPond.getFile(0).file;
    this.readAsBase64(file)
      .then(base64 => {
        this.postForm.patchValue({
          image: base64
        });
      })
      .catch(err => {
        this.snackBar.open(err, "Close", {
          duration: 2000
        });
      });
  }

  handleRemoveFile() {
    this.postForm.patchValue({
      image: ""
    });
  }

  readAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener("load", () => {
        resolve(reader.result);
      });
      reader.addEventListener("error", err => {
        reject(err);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }

  close() {
    this.dialogRef.close();
  }
}
