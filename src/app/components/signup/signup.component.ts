import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { TokenService } from "../../services/token.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      fullname: ["", Validators.required],
      username: ["", Validators.required],
      birthday: [new Date(), Validators.required],
      sex: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required]
    });
  }

  signupUser() {
    this.authService.registerUser(this.signupForm.value).subscribe(
      res => {
        // Setting the token
        this.tokenService.setToken(res.token);
        this.signupForm.reset({
          birthday: new Date()
        });
        this.router.navigate(["home"]);
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

  getEmailError() {
    const email = this.signupForm.get("email");
    return email.hasError("required")
      ? "Email is required"
      : email.hasError("email")
      ? "Not a valid email"
      : "";
  }
}
