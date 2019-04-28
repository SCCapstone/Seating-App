import { Component, OnInit, OnDestroy } from "@angular/core";
import "fabric";
import { FloorplansService } from "../floorplan.service";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Floorplan } from "../floorplan.model";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Form, FormGroup, Validators, FormControl } from "@angular/forms";
import { Store } from "../../store/store.model";
import { StoresService } from "../../store/stores.service";
import { WelcomeService } from "../../../welcome/welcome.service";

declare let fabric;

@Component({
  selector: "app-fp-builder-edit",
  templateUrl: "./fp-builder-edit.component.html",
  styleUrls: ["./fp-builder-edit.component.css"]
})
export class FpBuilderEditComponent implements OnInit {
  private canvas;
  private rectTable;
  private circleTable;
  private textBox;

  floorplan: Floorplan;
  floorplanList: Floorplan[] = [];
  selected = "None";
  private mode = "create";
  private floorplanId: string;
  private floorplansSub: Subscription;
  private authStatusSub: Subscription;
  private storesSub: Subscription;

  store: Store;
  storeList: Store[] = [];
  totalStores = 0;

  form: FormGroup;

  totalFloorplans = 0;

  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public dialogRef: MatDialogRef<FpBuilderEditComponent>,
    public floorplansService: FloorplansService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public storesService: StoresService,
    public welcomeService: WelcomeService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.floorplansService.getFloorplans();
    this.userId = this.authService.getUserId();
    this.floorplansSub = this.floorplansService
      .getFloorplanUpdateListener()
      .subscribe(
        (floorplanData: {
          floorplans: Floorplan[];
          floorplanCount: number;
        }) => {
          this.isLoading = false;
          this.totalFloorplans = floorplanData.floorplanCount;
          this.floorplanList = floorplanData.floorplans;
        }
      );

    this.form = new FormGroup({
      store: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    // Brett bringing a list of stores
    this.storesService.getStores();
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[]; storeCount: number }) => {
        this.isLoading = false;
        this.totalStores = storeData.storeCount;
        this.storeList = storeData.stores;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec = document.getElementById("canvas-wrap");
    this.canvas.setHeight(canvasSpec.clientHeight - 50);
    this.canvas.setWidth(canvasSpec.clientWidth);

    console.log("loading floorplan");
    this.mode = "edit";
    this.floorplanId = this.floorplansService.getFloorplanToEdit();

    // Sets the store form to the current store that the floorplan belongs to.
    this.floorplansService
      .getFloorplan(this.floorplansService.getFloorplanToEdit())
      .subscribe(fpData => {
        this.form.setValue({
          store: fpData.storeId
        });
      });

    console.log("floorplan id: " + this.floorplanId);
    this.isLoading = true;
    this.floorplansService
      .getFloorplan(this.floorplanId)
      .subscribe(floorplanData => {
        this.isLoading = false;
        this.floorplan = {
          id: floorplanData._id,
          name: floorplanData.name,
          json: floorplanData.json,
          creator: floorplanData.creator,
          storeId: floorplanData.storeId
        };
        console.log(this.floorplan.json);
        this.canvas.loadFromJSON(this.floorplan.json);
      });
    this.canvas.renderAll();
  }

  /**
   * Creates a rectangle table object and places it in the center of the canvas.
   */
  addRect() {
    const maxNameLength = 4;
    // prompt to get table number.
    const tableName = prompt(
      "What is the table number?",
      "Please enter a table number."
    );
    // remove overlapping word issue by checking input length
    if (tableName.length > maxNameLength) {
      this.addRect();
    } else {
      // creates rectangle object
      this.rectTable = new fabric.Rect({
        width: 70,
        height: 70,
        fill: "#7B638E",
        originX: "center",
        originY: "center"
      });

      // Adds subclasses for rectangles
      this.rectTable.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            name: this.name,
            serverId: this.serverId,
            capacity: this.capacity,
            partyName: this.partyName,
            guestsSeated: this.guestsSeated,
            timeSeated: this.timeSeated,
            notes: this.notes,
            resId: this.resId
          });
        };
      })(this.rectTable.toObject);

      this.rectTable.name = tableName;
      this.rectTable.serverId = "";
      this.rectTable.capacity = 0;
      this.rectTable.partyName = "";
      this.rectTable.guestsSeated = 0;
      this.rectTable.timeSeated = "";
      this.rectTable.notes = "";
      this.rectTable.resId = "";

      // creates textbox
      this.textBox = new fabric.Textbox(tableName, {
        originX: "center",
        originY: "center",
        fontSize: 36,
        fill: "white"
      });

      // groups them together
      const group = new fabric.Group([this.rectTable, this.textBox], {
        top: 100,
        left: 150
      });
      this.canvas.add(group);
      this.canvas.centerObject(group);
    }
  }

  // Add a circle object to the canvas
  addCircle() {
    const maxNameLength = 4;
    // prompt to get party size
    const tableName = prompt(
      "What is the table number?",
      "Please enter a table number."
    );
    // creates circle
    if (tableName.length > maxNameLength) {
      this.addCircle();
    } else {
      this.circleTable = new fabric.Circle({
        radius: 42,
        fill: "#7B638E",
        originX: "center",
        originY: "center"
      });

      // Adds subclassing for circles
      this.circleTable.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            name: this.name,
            serverId: this.serverId,
            capacity: this.capacity,
            partyName: this.partyName,
            guestsSeated: this.guestsSeated,
            timeSeated: this.timeSeated,
            notes: this.notes,
            resId: this.resId
          });
        };
      })(this.circleTable.toObject);

      this.circleTable.name = tableName;
      this.circleTable.serverId = "";
      this.circleTable.capacity = 0;
      this.circleTable.partyName = "";
      this.circleTable.guestsSeated = 0;
      this.circleTable.timeSeated = "";
      this.circleTable.notes = "";
      this.circleTable.resId = "";

      // creates textbox
      this.textBox = new fabric.Textbox(tableName, {
        originX: "center",
        originY: "center",
        fontSize: 36,
        fill: "white"
      });
      // groups them together
      const group = new fabric.Group([this.circleTable, this.textBox], {
        top: 100,
        left: 150
      });
      this.canvas.add(group);
      this.canvas.centerObject(group);
    }
  }

  // Delete the selected object
  discardObject() {
    this.canvas.remove(this.canvas.getActiveObject());
  }

  /**
   * Saves the floorplan to the database
   */
  saveCanvas() {
    console.log("Saving Canvas!");
    const json_data = this.canvas.toJSON([
      "guestsSeated",
      "name",
      "notes",
      "serverId",
      "timeSeated",
      "partyName",
      "resId"
    ]);
    console.log("Argument ID: " + this.floorplan.id);
    this.floorplansService
      .updateFloorplan(
        this.floorplan.id,
        this.floorplan.name,
        json_data,
        this.form.value.store
      )
      .subscribe(() => {
        this.floorplansService.getFloorplans();
      });

    this.dialogRef.close();
  }

  /**
   * Deletes the floorplan with the provided ID from the server.
   * @param id The ID of the floorplan to be deleted
   */
  deleteFloorplan(id: string) {
    console.log("Deleting Floorplan with ID: " + id);

    // Checking to see if the default floorplan was just deleted.
    // If it was, sets default to null.
    this.floorplansService.getFloorplan(id).subscribe(fpData => {
      this.storesService.getStore(fpData.storeId).subscribe(storeData => {
        if (storeData.defaultFloorplan === id) {
          console.log("You just deleted the store's default floorplan!");
          this.storesService
            .updateStore(storeData._id, storeData.name, null)
            .subscribe(() => {
              this.storesService.getStores();
            });
        }
      });
    });

    this.floorplansService.deleteFloorplans(id).subscribe(() => {
      console.log("Deleted!");
      this.floorplansService.getFloorplans();
    });
    this.dialogRef.close();
    this.canvas.renderAll();
  }

  /**
   * Closes the dialog box.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
