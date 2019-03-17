import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { FloorplansService } from "../manager/fp-builder/floorplan.service";
import { Server } from "../manager/servers/server.model";

@Injectable({ providedIn: "root" })
export class DashboardService {

  canvas;

  // Not currently used, but might be needed later
  selectedStoreID = "None";

  private selectedFloorplanID = "None";
  private selectedFloorplanName = "None";
  private selectedFloorplanJSON = null;
  private selectedTable = null;

  userIsAuthenticated = false;
  userId: string;
  servers: Server[] = [];

  @Output() fpChange: EventEmitter<string> = new EventEmitter();
  @Output() tableChange: EventEmitter<object> = new EventEmitter();

  constructor(
    private router: Router,
    public floorplansService: FloorplansService
  ) {}

  /**
   * Loads a canvas to the dashboard.
   * @param id the floorplan ID that is being loaded
   * @param name the name of the floorplan that is being loaded
   * @param json the JSON data that is being loaded.
   */
  dashLoadCanvas (id, name, json) {
    this.selectedFloorplanID = id;
    this.selectedFloorplanName = name;
    this.selectedFloorplanJSON = json;

    this.selectedTable = null;
    this.tableChange.emit(null);
    this.fpChange.emit(this.selectedFloorplanID);
  }

  /**
   * Updates the currently selected table.
   * @param guestsSeated the new number of guests sitting at the table.
   */
  dashUpdateTable(guestsSeated: number, notes: string, server: Server) {
    this.selectedTable.target._objects[0].guestsSeated = guestsSeated;
    this.selectedTable.target._objects[0].notes = notes;
    this.selectedTable.target._objects[0].serverId = server;
    if (guestsSeated !== 0) {
      this.selectedTable.target._objects[0].setColor("#4c86d1");
    } else {
      this.selectedTable.target._objects[0].setColor("#7B638E");
    }

    this.selectedTable.target._objects[0].set({
      stroke: server.color,
      strokeWidth: 5
    });
    this.canvas.renderAll();
    this.selectedFloorplanJSON = this.canvas.toJSON([
      "guestsSeated",
      "name",
      "notes",
      "serverId",
      "timeSeated",
      "partyName"
    ]);

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
