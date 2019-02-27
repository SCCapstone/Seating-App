import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class DashboardService {

  selectedStoreID = "None";
  selectedFloorplanName = "None";
  selectedFloorplanID = "None";
  selectedTable = null;

  numSeated = null;

  changedFPID = "None";
  changedTable = null;

  @Output() change: EventEmitter<string> = new EventEmitter();
  @Output() tableChange: EventEmitter<object> = new EventEmitter();

  constructor(
    private router: Router
  ) {}

  dashLoadCanvas () {
    this.changedFPID = this.selectedFloorplanID;
    this.change.emit(this.changedFPID);
    console.log("Dashboard: \n" + this.selectedStoreID, "\n", this.selectedFloorplanID, this.selectedFloorplanName);
  }

  dashSetTable() {
    console.log("selectedTable: ", this.selectedTable.target._objects[0].name);
    this.changedTable = this.selectedTable;
    this.tableChange.emit(this.changedTable);
    console.log("Changing table from dashboard");
  }

  setTableSeated(numSeated: string) {
    this.numSeated = numSeated;
  }
}
