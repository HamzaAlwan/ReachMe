import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTabsComponent } from '../../components/auth-tabs/auth-tabs.component';
import { AngularMaterialModule } from '../angular-material.module';
import { LoginComponent } from '../../components/login/login.component';
import { SignupComponent } from '../../components/signup/signup.component';
import { AuthService } from '../../services/auth.service';

@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [AuthTabsComponent, LoginComponent, SignupComponent],
  exports: [AuthTabsComponent, LoginComponent, SignupComponent],
  providers: [AuthService]
})
export class AuthModule {}
