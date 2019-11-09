import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { TokenService } from '../../services/token.service';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {
  token: any;
  constructor(private tokenService: TokenService, private dialog: MatDialog) {}

  ngOnInit() {
    this.token = this.tokenService.getToken();
  }

  onCreatePostOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '65%';
    this.dialog.open(PostFormComponent, dialogConfig);
  }
}
