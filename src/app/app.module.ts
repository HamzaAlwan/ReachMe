import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { GroupModule } from "./modules/group.module";
import { CookieService } from "ngx-cookie-service";
import { TokenInterceptor } from "./services/token-interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, GroupModule],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
