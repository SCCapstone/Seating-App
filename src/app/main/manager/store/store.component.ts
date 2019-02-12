import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {

  constructor(public dialog: MatDialog) { }

  openAddStore(): void {
    const dialogRef = this.dialog.open(StoreAddComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEditStore(): void {
    const dialogRef = this.dialog.open(StoreEditComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'app-store-add',
  templateUrl: 'store-add.component.html',
})
export class StoreAddComponent {

  constructor(
    public dialogRef: MatDialogRef<StoreAddComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-store-edit',
  templateUrl: 'store-edit.component.html',
})
export class StoreEditComponent {

  constructor(
    public dialogRef: MatDialogRef<StoreEditComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

