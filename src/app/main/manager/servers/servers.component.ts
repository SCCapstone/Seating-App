import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent {

  constructor(public dialog: MatDialog) { }

  openAddServer(): void {
    const dialogRef = this.dialog.open(ServersAddComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditServer(): void {
    const dialogRef = this.dialog.open(ServersEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'app-servers-add',
  templateUrl: 'servers-add.component.html',
})
export class ServersAddComponent {

  constructor(
    public dialogRef: MatDialogRef<ServersAddComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-servers-edit',
  templateUrl: 'servers-edit.component.html',
})
export class ServersEditComponent {

  constructor(
    public dialogRef: MatDialogRef<ServersEditComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
