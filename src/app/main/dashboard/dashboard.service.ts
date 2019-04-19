import { Injectable, Output, EventEmitter } from "@angular/core";
import { Subject, Observable, forkJoin, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { FloorplansService } from "../manager/fp-builder/floorplan.service";
import { Server } from "../manager/servers/server.model";
import { Reservation } from "../reservations/reservation.model";
import { ServersService } from "../manager/servers/servers.service";
// import { Reservation } from "../../manager/reservations/reservation.model";

@Injectable({ providedIn: "root" })
export class DashboardService {

  canvas;

  selectedStoreID = "None";

  private selectedFloorplanID = "None";
  private selectedFloorplanName = "None";
  private selectedFloorplanJSON = null;
  private selectedTable = null;
  private selectedFloorplanStoreID = "None";

  userIsAuthenticated = false;
  userId: string;
  servers: Server[] = [];
 // reservations: Reservation[] = [];

  @Output() fpChange: EventEmitter<string> = new EventEmitter();
  @Output() tableChange: EventEmitter<object> = new EventEmitter();

  constructor(
    private router: Router,
    public floorplansService: FloorplansService,
    private serversService: ServersService
  ) {}

  /**
   * Loads a canvas to the dashboard.
   * @param id the floorplan ID that is being loaded
   * @param name the name of the floorplan that is being loaded
   * @param json the JSON data that is being loaded.
   */
  dashLoadCanvas (id, name, json, storeId) {
    this.selectedFloorplanID = id;
    this.selectedFloorplanName = name;
    this.selectedFloorplanJSON = json;
    this.selectedFloorplanStoreID = storeId;

    this.selectedTable = null;
    this.tableChange.emit(null);
    this.fpChange.emit(this.selectedFloorplanID);
  }

  /**
   * Updates the currently selected table.
   * @param guestsSeated the new number of guests sitting at the table.
   */
  dashUpdateTable(guestsSeated: number, notes: string, server: Server, resId: string) {
    this.selectedTable.target._objects[0].guestsSeated = guestsSeated;
    this.selectedTable.target._objects[0].notes = notes;
    this.selectedTable.target._objects[0].serverId = server;
    this.selectedTable.target._objects[0].resId = resId;
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
      "partyName",
      "resId"
    ]);

    this.floorplansService.updateFloorplan(
      this.selectedFloorplanID,
      this.selectedFloorplanName,
      this.selectedFloorplanJSON,
      this.selectedFloorplanStoreID
      )
      .subscribe(() => {
        this.floorplansService.getFloorplans();
      });
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

  dashUpdateTables() {
    console.log("dashUpdateTables called");
    const tables = this.canvas.getObjects();
    tables.forEach(table => {
      const server = table._objects[0].serverId;
      if (server !== null && server.id !== null) {
        // console.log(this.servers);
        this.servers.forEach(tempServer => {
          if (tempServer.id === table._objects[0].serverId.id) {
            table._objects[0].serverId.color = tempServer.color;
            table._objects[0].set({
              stroke: tempServer.color,
              strokeWidth: 5
            });
          }
        });
        this.canvas.renderAll();
        }
      });
      this.dashSaveCanvas();

  }

  dashClearTables() {
    const tables = this.canvas.getObjects();
    tables.forEach(table => {
      table._objects[0].set({
        guestsSeated: 0,
        notes: "",
        serverId: "",
        partyName: "",
        strokeWidth: 0,
        resId: ""
      });
      table._objects[0].setColor("#7B638E");
      console.log("guests seated: " + table._objects[0].guestsSeated);
    });
    this.canvas.renderAll();
    this.dashSaveCanvas();
  }

  dashSaveCanvas() {
    this.selectedFloorplanJSON = this.canvas.toJSON([
      "guestsSeated",
      "name",
      "notes",
      "serverId",
      "timeSeated",
      "partyName",
      "resId"
    ]);

    // console.log(this.selectedFloorplanName);
    // console.log(this.selectedFloorplanJSON);
    this.floorplansService.updateFloorplan(
      this.selectedFloorplanID,
      this.selectedFloorplanName,
      this.selectedFloorplanJSON,
      this.selectedFloorplanStoreID
      )
      .subscribe(() => {
        this.floorplansService.getFloorplans();
      });
    // console.log("THIS IS THE END OF THE FUNCTION");
  }
}
