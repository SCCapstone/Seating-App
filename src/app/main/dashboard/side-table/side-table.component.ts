import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { DashboardService } from '../dashboard.service';
import { SeatTableComponent } from "../side-table/seat-table/seat-table.component";
import { Server } from '../../manager/servers/server.model';

@Component({
  selector: 'app-side-table',
  templateUrl: './side-table.component.html',
  styleUrls: ['./side-table.component.css']
})
export class SideTableComponent implements OnInit {

  tableName = "";
  guestsSeated = 0;
  notes = "";
  private tableServer: Server;
  serverName = "";

  constructor(
    public dialog: MatDialog,
    public dashboardService: DashboardService
  ) {}

  ngOnInit() {
    // Listener for when the selected table is changed
    this.dashboardService.tableChange.subscribe(changedTable => {
       this.getTableData(changedTable);
     });
  }

  /**
   * This function opens the seat table dialog box for assigning a number of
   * guests to a table, but only if a table has been selected.
   */
  openSeatTable() {
    // Checks to see if a table has been selected
    if (this.dashboardService.dashGetTable() !== null) {
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

  /**
   * clears out the temporary data from the selected table.
   * (Guests seated, notes, etc). Currently leaves the assigned server.
   */
  clearTable() {
    if (this.dashboardService.dashGetTable() !== null) {
      this.guestsSeated = 0;
      this.notes = "";
      this.dashboardService.dashUpdateTable(0, "", this.tableServer);
    }
  }

  /**
   * Gets the table properties from a table object.
   * @param table the selected table.
   */
  getTableData(table) {
    if (table !== null) {
      // Change the data in the HTML form
      this.tableName = table.target._objects[0].name;
      this.guestsSeated = table.target._objects[0].guestsSeated;
      this.notes = table.target._objects[0].notes;
      this.tableServer = table.target._objects[0].serverId;
      this.serverName = this.tableServer.name;
    } else {
      this.tableName = "";
      this.guestsSeated = 0;
      this.notes = "";
      this.tableServer = null;
      this.serverName = "";
    }
  }
}


