import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth/auth-routing.module";
import { StreamsModule } from "./streams/streams.module";
import { AuthModule } from "./auth/auth.module";
import { StreamsRoutingModule } from "./streams/streams-routing.module";
import { NgxAutoScrollModule } from "ngx-auto-scroll";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    AuthRoutingModule,
    StreamsModule,
    StreamsRoutingModule,
    NgxAutoScrollModule
  ],
  exports: [
    AuthModule,
    AuthRoutingModule,
    StreamsModule,
    StreamsRoutingModule,
    NgxAutoScrollModule
  ]
})
export class GroupModule {}
