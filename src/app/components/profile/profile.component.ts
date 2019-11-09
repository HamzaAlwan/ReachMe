import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar, MatDialog, MatDialogConfig } from "@angular/material";

import io from "socket.io-client";

import { UsersService } from "../../services/users.service";
import { TokenService } from "../../services/token.service";
import { UpdatePasswordComponent } from "../update-password/update-password.component";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  @ViewChild("myPond") myPond: any;

  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: `Drag & Drop your picture or <span style="outline: none" class="filepond--label-action">Browse</span>`,
    acceptedFileTypes: "image/jpeg, image/png, image/svg, image/jpg",
    imagePreviewHeight: 170,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 100,
    stylePanelLayout: "compact circle",
    styleLoadIndicatorPosition: "center bottom",
    styleButtonRemoveItemPosition: "center bottom",
    imageCropAspectRatio: "1:1",
    allowImageResize: true
  };

  profileForm: FormGroup;

  currentUser: any;
  socket: any;
  init = true;

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.socket = io(environment.socket_io);
  }

  ngOnInit() {
    this.currentUser = this.tokenService.getPayload();
    this.getCurrentUser();
    this.profileForm = this.fb.group({
      image: "",
      fullname: ["", Validators.required],
      username: ["", Validators.required],
      birthday: [new Date(), Validators.required],
      sex: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      phone_number: [""]
    });
    this.socket.on("refreshPage", () => {
      this.getCurrentUser();
    });
  }

  getCurrentUser() {
    this.usersService.getUserById(this.currentUser._id).subscribe(data => {
      this.currentUser = data.user;
      this.profileForm.setValue({
        image: "",
        fullname: data.user.fullname,
        username: data.user.username,
        birthday: new Date(data.user.birthday),
        sex: data.user.sex,
        email: data.user.email,
        phone_number: data.user.phone_number ? data.user.phone_number : ""
      });
      this.initUserForm(data.user.image);
    });
  }

  async initUserForm(image) {
    await fetch(
      `https://res.cloudinary.com/my-chat-app/image/upload/v${image.version}/${image.id}`
    )
      .then(res => res.blob())
      .then(async file => this.myPond.addFile(file));
  }

  onUpdatePasswordOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "45%";
    dialogConfig.data = { _id: this.currentUser._id };
    this.dialog.open(UpdatePasswordComponent, dialogConfig);
  }

  handleAddFile() {
    if (!this.init) {
      const file = this.myPond.getFile(0).file;
      this.readAsBase64(file)
        .then(base64 => {
          this.profileForm.patchValue({
            image: base64
          });
        })
        .catch(err => {
          this.snackBar.open(err, "Close", {
            duration: 2000
          });
        });
    } else {
      this.init = false;
    }
  }

  handleRemoveFile() {
    this.profileForm.patchValue({
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

  updateProfile() {
    this.usersService
      .updateProfile({
        ...this.profileForm.value,
        userId: this.currentUser._id
      })
      .subscribe(
        res => {
          this.tokenService.setToken(res.token);
          this.socket.emit("refresh", {});
        },
        err => {
          if (err.error.messageJoi) {
            this.snackBar.open(err.error.messageJoi[0].message, "Close", {
              duration: 3000
            });
          } else if (err.error.message) {
            this.snackBar.open(err.error.message, "Close", {
              duration: 3000
            });
          } else {
            this.snackBar.open("Internal server error", "Close", {
              duration: 3000
            });
          }
        }
      );
  }

  getEmailError() {
    const email = this.profileForm.get("email");
    return email.hasError("required")
      ? "Email is required"
      : email.hasError("email")
      ? "Not a valid email"
      : "";
  }
}
