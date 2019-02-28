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
    // Listener for when the selected table is changed
    this.dashboardService.tableChange.subscribe(changedTable => {
      this.changedTable = changedTable;
      this.getTableData(this.changedTable);
     });
  }

  openSeatTable(){
    // Checks to see if a table has been selected
    if (this.dashboardService.selectedTable !== null) {
      const dialogRef = this.dialog.open(SeatTableComponent, {
        width: "500px"
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    } else {
      console.log("No table selectd");
    }


  }

  getTableData(table) {

    // Change the data in the HTML form
    this.tableName = table.target._objects[0].name;
    this.numSeated = table.target._objects[0].guestsSeated;
  }
}


