import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { FloorplansService } from "../manager/fp-builder/floorplan.service";

@Injectable({ providedIn: "root" })
export class DashboardService {

  // floorplansService: FloorplansService;

  canvas;

  selectedStoreID = "None";
  selectedFloorplanName = "None";
  selectedFloorplanID = "None";
  selectedFloorplanJSON = null;
  selectedTable = null;

  changedFPID = "None";
  changedTable = null;

  @Output() change: EventEmitter<string> = new EventEmitter();
  @Output() tableChange: EventEmitter<object> = new EventEmitter();

  constructor(
    private router: Router,
    public floorplansService: FloorplansService
  ) {}

  dashLoadCanvas () {
    this.changedFPID = this.selectedFloorplanID;
    this.change.emit(this.changedFPID);
  }

  dashSetTable() {
    this.changedTable = this.selectedTable;
    this.tableChange.emit(this.changedTable);

  }

  dashUpdateTable(numSeated: string) {
    this.selectedTable.target._objects[0].guestsSeated = numSeated;
    if (numSeated !== "0") {
      console.log("its not 0");
      this.selectedTable.target._objects[0].setColor("#4c86d1");
      this.canvas.renderAll();
    } else {
      console.log("it is 0!");
      this.selectedTable.target._objects[0].setColor("#7B638E");
      this.canvas.renderAll();
    }
    // console.log(this.selectedFloorplanJSON);
    this.selectedFloorplanJSON = this.canvas.toJSON([
      "guestsSeated",
      "name",
      "notes",
      "serverId",
      "timeSeated"
    ]);
    // console.log(this.selectedFloorplanJSON);
    this.floorplansService.updateFloorplan(
      this.selectedFloorplanID,
      this.selectedFloorplanName,
      this.selectedFloorplanJSON
      );
  }
}
