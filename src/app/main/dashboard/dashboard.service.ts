import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class DashboardService {

  selectedStoreID = "None";
  selectedFloorplanName = "None";
  selectedFloorplanID = "None";

  changedFPID = "None";

  @Output() change: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router
  ) {}

  dashLoadCanvas () {
    this.changedFPID = this.selectedFloorplanID;
    this.change.emit(this.changedFPID);
    console.log("Dashboard: \n" + this.selectedStoreID, "\n", this.selectedFloorplanID, this.selectedFloorplanName);
  }
}
