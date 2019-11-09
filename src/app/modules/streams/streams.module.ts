import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

// Services
import { AngularMaterialModule } from "../angular-material.module";
import { TokenService } from "../../services/token.service";
import { PostsService } from "../../services/posts.service";
import { UsersService } from "../../services/users.service";
import { NotificationsService } from "../../services/notifications.service";
import { MessagesService } from "src/app/services/messages.service";

import { UploadDirective } from "../../directives/upload.directive";

import { StreamsComponent } from "../../components/streams/streams.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { SideComponent } from "../../components/side/side.component";
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { PostsComponent } from "../../components/posts/posts.component";
import { CommentsComponent } from "../../components/comments/comments.component";
import { PeopleComponent } from "../../components/people/people.component";
import { FollowingComponent } from "../../components/following/following.component";
import { FollowersComponent } from "../../components/followers/followers.component";
import { NotificationsComponent } from "../../components/notifications/notifications.component";
import { ChatComponent } from "../../components/chat/chat.component";
import { MessagesComponent } from "../../components/messages/messages.component";
import { ProfileComponent } from "../../components/profile/profile.component";

import { FilePondModule, registerPlugin } from "ngx-filepond";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import { UpdatePasswordComponent } from "../../components/update-password/update-password.component";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop
);
@NgModule({
  imports: [CommonModule, AngularMaterialModule, RouterModule, FilePondModule],
  declarations: [
    StreamsComponent,
    NavbarComponent,
    SideComponent,
    PostFormComponent,
    PostsComponent,
    UploadDirective,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    FollowersComponent,
    NotificationsComponent,
    ChatComponent,
    MessagesComponent,
    ProfileComponent,
    UpdatePasswordComponent
  ],
  exports: [
    StreamsComponent,
    NavbarComponent,
    SideComponent,
    PostFormComponent,
    PostsComponent,
    UploadDirective,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    UpdatePasswordComponent
  ],
  providers: [
    TokenService,
    PostsService,
    UsersService,
    NotificationsService,
    MessagesService
  ],
  entryComponents: [
    PostFormComponent,
    CommentsComponent,
    UpdatePasswordComponent
  ]
})
export class StreamsModule {}
