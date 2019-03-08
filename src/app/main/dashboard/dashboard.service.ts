import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { FloorplansService } from "../manager/fp-builder/floorplan.service";

@Injectable({ providedIn: "root" })
export class DashboardService {

  canvas;

  // Not currently used, but might be needed later
  private selectedStoreID = "None";

  private selectedFloorplanID = "None";
  private selectedFloorplanName = "None";
  private selectedFloorplanJSON = null;
  private selectedTable = null;

  @Output() fpChange: EventEmitter<string> = new EventEmitter();
  @Output() tableChange: EventEmitter<object> = new EventEmitter();

  constructor(
    private router: Router,
    public floorplansService: FloorplansService
  ) {}

  dashLoadCanvas (id, name, json) {
    this.selectedFloorplanID = id;
    this.selectedFloorplanName = name;
    this.selectedFloorplanJSON = json;

    this.selectedTable = null;
    this.tableChange.emit(null);
    this.fpChange.emit(this.selectedFloorplanID);
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

  /**
   * Setter for store.
   * @param storeID id value to be passed in as store ID.
   */
  dashSetStore(storeID) {
    this.selectedStoreID = storeID;
  }

  /**
   * Setter for table. This function updates the table object as well as emits
   * a change.
   * @param table table object that has been selected.
   */
  dashSetTable(table) {
    this.selectedTable = table;
    this.tableChange.emit(this.selectedTable);
  }

  /**
   * Gets selected table object.
   * @returns the currently selected table.
   */
  dashGetTable() {
    return this.selectedTable;
  }

  /**
   * Same functionality as dashSetTable, except this does not update the
   * selected table. Simply calls the emitter for refreshing data.
   */
  dashRefreshTable() {
    this.tableChange.emit(this.selectedTable);
  }
}
