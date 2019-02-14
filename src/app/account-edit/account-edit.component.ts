import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEComponent {

  constructor(public dialog: MatDialog) { }

  openAddHost(): void {
    const dialogRef = this.dialog.open(AccountEComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditHost(): void {
    const dialogRef = this.dialog.open(AccountEComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}


@Component({ //may need to get rid of
  selector: 'app-account-edit-add',
  templateUrl: 'hosts-add.component.html',
})
export class AccountAddComponent {

  constructor(
    public dialogRef: MatDialogRef<AccountAddComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-account-edit',
  templateUrl: 'account-edit.component.html',
})
export class AccountEditComponent {

  constructor(
    public dialogRef: MatDialogRef<AccountEditComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
