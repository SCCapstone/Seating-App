import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { DashboardService } from '../dashboard.service';
import { SeatTableComponent } from "../side-table/seat-table/seat-table.component";

@Component({
  selector: 'app-side-table',
  templateUrl: './side-table.component.html',
  styleUrls: ['./side-table.component.css']
})
export class SideTableComponent implements OnInit {

  changedTable = null;
  tableName = "";
  numSeated = 0;

  constructor(
    public dialog: MatDialog,
    public dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardService.tableChange.subscribe(changedTable => {
      this.changedTable = changedTable;
      this.getTableData(this.changedTable);
     });
  }

  openSeatTable(): void {
    const dialogRef = this.dialog.open(SeatTableComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  getTableData(table) {
    this.tableName = table.target._objects[0].name;
    this.numSeated = table.target._objects[0].guestsSeated;
    // console.log("Final step - table data should be here: ", table);
  }
}


