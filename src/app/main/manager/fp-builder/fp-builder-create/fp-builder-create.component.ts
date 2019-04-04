import { Component, OnInit, OnDestroy } from "@angular/core";
import "fabric";
import { FloorplansService } from "../floorplan.service";
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Floorplan } from "../floorplan.model";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Form, FormGroup, Validators, FormControl } from "@angular/forms";
import { Store } from "../../store/store.model";
import { StoresService } from "../../store/stores.service";


declare let fabric;

@Component({
  selector: "app-fp-builder-create",
  templateUrl: "./fp-builder-create.component.html",
  styleUrls: ["./fp-builder-create.component.css"]
})
export class FpBuilderCreateComponent implements OnInit {
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
  defaultFloorplan: string;
  totalStores = 0;

  form: FormGroup;

  totalFloorplans = 0;

  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public dialogRef: MatDialogRef<FpBuilderCreateComponent>,
    public floorplansService: FloorplansService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public storesService: StoresService
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
        .subscribe(
          (storeData: {
            stores: Store[];
            storeCount: number;
          }) => {
            this.isLoading = false;
            this.totalStores = storeData.storeCount;
            this.storeList = storeData.stores;
          }
        );

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

/*     this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    }); */
    this.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec  = document.getElementById("canvas-wrap");
    this.canvas.setHeight(canvasSpec.clientHeight - 50);
    this.canvas.setWidth(canvasSpec.clientWidth);

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has("floorplanId")) {
        console.log("loading floorplan");
        this.mode = "edit";
        this.floorplanId = paramMap.get("floorplanId");
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
          });
      } else {
        console.log("Creating floorplan");
        this.mode = "create";
        this.floorplanId = null;
      }
    });
  }

/**
 * Creates a rectangle table object and places it in the center of the canvas.
 */
addRect() {

  const maxNameLength = 4;
  // prompt to get table number.
  const tableName = prompt("What is the table number?", "Please enter a table number.");
  // remove overlapping word issue by checking input length
  if (tableName.length > maxNameLength) {
    this.addRect();
  } else {
        // creates rectangle object
        this.rectTable = new fabric.Rect({
          width: 100,
          height: 100,
          fill: "#7B638E",
          originX: "center",
          originY: "center",
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
              notes: this.notes
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

        // creates textbox
        this.textBox = new fabric.Textbox(tableName, {
          originX: "center",
          originY: "center",
          fontSize: 64,
          fill: "white"
        });

        // groups them together
        const group = new fabric.Group([this.rectTable, this.textBox ], {
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
    const tableName = prompt("What is the table number?", "Please enter a table number.");
    // creates circle
    if (tableName.length > maxNameLength) {
      this.addCircle();
    } else {
      this.circleTable = new fabric.Circle({
        radius: 75,
        fill: "#7B638E",
        originX: "center",
        originY: "center",
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
            notes: this.notes
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

      // creates textbox
      this.textBox = new fabric.Textbox(tableName, {
        originX: "center",
        originY: "center",
        fontSize: 64,
        fill: "white"
      });
     // groups them together
      const group = new fabric.Group([this.circleTable, this.textBox ], {
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
   * Saves the canvas to the database
  */
  saveCanvas() {
    console.log("Saving Canvas!");
    const json_data = this.canvas.toJSON();

    const fpName = prompt("Enter name for floorplan", "");
    console.log("Store: " + this.form.value.store);
    this.floorplansService
      .addFloorplan(
        fpName,
        json_data,
        this.form.value.store
      )
      .subscribe(() => {
        this.floorplansService.getFloorplans();
      });
    this.dialogRef.close();
  }
}