import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from "@angular/material";

import io from "socket.io-client";

import { UsersService } from "../../services/users.service";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.component.html",
  styleUrls: ["./update-password.component.scss"]
})
export class UpdatePasswordComponent implements OnInit {
  passwordForm: FormGroup;

  socket: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private user: any,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdatePasswordComponent>
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      old_password: ["", Validators.required],
      new_password: ["", Validators.required],
      confirm_password: ["", Validators.required]
    });

    this.socket.on("refreshPage", () => {});
  }
  onSubmit() {
    this.usersService
      .updatePassword({ ...this.passwordForm.value, userId: this.user._id })
      .subscribe(
        () => {
          this.socket.emit("refresh", {});
          this.dialogRef.close();
          this.passwordForm.reset();
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

  close() {
    this.dialogRef.close();
  }
}
