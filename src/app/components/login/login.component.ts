import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { TokenService } from "../../services/token.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required]
    });
  }

  loginUser() {
    this.authService.loginUser(this.loginForm.value).subscribe(
      res => {
        // Setting the token
        this.tokenService.setToken(res.token);
        this.loginForm.reset();
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
    const email = this.loginForm.get("email");
    return email.hasError("required")
      ? "Email is required"
      : email.hasError("email")
      ? "Not a valid email"
      : "";
  }
}
