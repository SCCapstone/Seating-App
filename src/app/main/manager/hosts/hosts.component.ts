import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.css']
})
export class HostsComponent {

  constructor(public dialog: MatDialog) { }

  openAddHost(): void {
    const dialogRef = this.dialog.open(HostsAddComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditHost(): void {
    const dialogRef = this.dialog.open(HostsEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'app-hosts-add',
  templateUrl: 'hosts-add.component.html',
})
export class HostsAddComponent {

  constructor(
    public dialogRef: MatDialogRef<HostsAddComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-hosts-edit',
  templateUrl: 'hosts-edit.component.html',
})
export class HostsEditComponent {

  constructor(
    public dialogRef: MatDialogRef<HostsEditComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
