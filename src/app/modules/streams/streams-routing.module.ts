import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../guard/auth.guard";
import { StreamsComponent } from "../../components/streams/streams.component";
import { PeopleComponent } from "../../components/people/people.component";
import { FollowingComponent } from "../../components/following/following.component";
import { FollowersComponent } from "../../components/followers/followers.component";
import { NotificationsComponent } from "../../components/notifications/notifications.component";
import { ChatComponent } from "../../components/chat/chat.component";
import { ProfileComponent } from "../../components/profile/profile.component";

const routes: Routes = [
  {
    path: "home",
    component: StreamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "people",
    component: PeopleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "people/following",
    component: FollowingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "people/followers",
    component: FollowersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "notifications",
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "chat/:name",
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {}
