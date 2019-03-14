import { Component, OnInit, OnDestroy } from "@angular/core";
import "fabric";
import { getNumberOfCurrencyDigits } from "@angular/common";
import { Canvas } from "fabric/fabric-impl";
import { FloorplansService } from "./floorplan.service";
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Floorplan } from "./floorplan.model";
import { ServersEditComponent } from "../servers/servers.component";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Form, FormGroup, Validators, FormControl } from "@angular/forms";
// import { exists } from "fs";

declare let fabric;

@Component({
  selector: "app-fp-builder",
  templateUrl: "./fp-builder.component.html",
  styleUrls: ["./fp-builder.component.css"]
})
export class FpBuilderComponent implements OnInit {
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

  totalFloorplans = 0;

  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public floorplansService: FloorplansService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public dialog: MatDialog
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
              creator: floorplanData.creator
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

  const maxTableNumber = 4;
  // prompt to get table number.
  const tableNumber = prompt("What is the table number?", "Please enter a table number.");
  // remove overlapping word issue by checking input length
  if (tableNumber.length <= maxTableNumber) {
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
          guestsSeated: this.guestsSeated,
          timeSeated: this.timeSeated,
          notes: this.notes
        });
      };
    })(this.rectTable.toObject);

    this.rectTable.name = tableNumber;
    this.rectTable.serverId = "";
    this.rectTable.capacity = 0;
    this.rectTable.guestsSeated = 0;
    this.rectTable.timeSeated = "";
    this.rectTable.notes = "";


    // creates textbox
    this.textBox = new fabric.Textbox(tableNumber, {
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
  } else {

    const newTableNumber = prompt("Table number cannot exceed 4 characters.", "Please enter a table number.");
    if (newTableNumber.length > maxTableNumber) {
      return;
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
          guestsSeated: this.guestsSeated,
          timeSeated: this.timeSeated,
          notes: this.notes
        });
      };
    })(this.rectTable.toObject);

    this.rectTable.name = newTableNumber;
    this.rectTable.serverId = "";
    this.rectTable.capacity = 0;
    this.rectTable.guestsSeated = 0;
    this.rectTable.timeSeated = "";
    this.rectTable.notes = "";


    // creates textbox
    this.textBox = new fabric.Textbox(newTableNumber, {
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

  }

  // Add a circle object to the canvas
  addCircle() {
    const maxTableNumber = 4;
    // prompt to get party size
    const tableNumber = prompt("What is the table number?", "Please enter a table number.");
    // creates circle
    if (tableNumber.length <= maxTableNumber) {
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
            guestsSeated: this.guestsSeated,
            timeSeated: this.timeSeated,
            notes: this.notes
          });
        };
      })(this.circleTable.toObject);

      this.circleTable.name = tableNumber;
      this.circleTable.serverId = "";
      this.circleTable.capacity = 0;
      this.circleTable.guestsSeated = 0;
      this.circleTable.timeSeated = "";
      this.circleTable.notes = "";

      // creates textbox
      this.textBox = new fabric.Textbox(tableNumber, {
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
    } else {
      const newTableNumber = prompt("Table number cannot exceed 4 characters.", "Please enter a table number.");
      if (newTableNumber.length > maxTableNumber) {
        return;
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
              guestsSeated: this.guestsSeated,
              timeSeated: this.timeSeated,
              notes: this.notes
            });
          };
        })(this.circleTable.toObject);

        this.circleTable.name = newTableNumber;
        this.circleTable.serverId = "";
        this.circleTable.capacity = 0;
        this.circleTable.guestsSeated = 0;
        this.circleTable.timeSeated = "";
        this.circleTable.notes = "";

        // creates textbox
        this.textBox = new fabric.Textbox(newTableNumber, {
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

  }

  // Delete the selected object
  discardObject() {
    this.canvas.remove(this.canvas.getActiveObject());
  }

  /**
   * Saves what is currently on the canvas to JSON data, and outputs onto console
  */
  saveCanvas() {
    // const json_data = JSON.stringify(this.canvas.toJSON());
    const json_data = this.canvas.toJSON();

    if (this.mode === "create") {
      const fpName = prompt("Enter name for floorplan", "");
      this.floorplansService.addFloorplan(
        fpName,
        json_data
      );
    } else {
      console.log("Argument ID: " + this.floorplan.id);
      this.floorplansService.updateFloorplan(
        this.floorplan.id,
        this.floorplan.name,
        json_data
      );
    }

    // This is where the json data will need to be put onto the server.
    // console.log(json_data);
  }

  /**
   * Prompts the user for JSON data, and then places it on the canvas.
   */
  loadCanvas(id: string) {
    // Currently prompts user for name. **TODO
    console.log("Loading Floorplan with ID: " + id);

    this.floorplansService.getFloorplan(id).subscribe(floorplanData => {
      this.floorplan = {
        id: floorplanData._id,
        name: floorplanData.name,
        json: floorplanData.json,
        creator: floorplanData.creator
      };
      this.selected = floorplanData.name;
      this.canvas.loadFromJSON(this.floorplan.json);
    });
    // Redraws the canvas.
    this.canvas.renderAll();

    this.mode = "edit";
    console.log("Edit mode entered");
  }

  deleteFloorplan(id: string) {
    // Currently prompts user for name. **TODO
    console.log("Deleteing Floorplan with ID: " + id);
    this.floorplansService.deleteFloorplans(id)
      .subscribe(() => {
        console.log("Deleted!");
      });
    this.canvas.renderAll();
  }

 openAddTable(): void {
   const dialogRef = this.dialog.open(TableAddComponent, {
     width: "500px"
   });

   dialogRef.afterClosed().subscribe(result => {
     console.log("The dialog was closed");
   });
 }
}

@Component({
  selector: "app-fp-builder-add",
  templateUrl: "./fp-builder-add.component.html",
  styleUrls: ["./fp-builder.component.css"]
})
export class TableAddComponent implements OnInit, OnDestroy {
  tableName = "";
  tableCapacity = 0;
  isLoading = false;
  form: FormGroup;

  // private rectTable;
  // private textBox;
  private tableID: string;;
  private capacityNum: string;

  constructor(
    public dialogRef: MatDialogRef<TableAddComponent>,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
  //  this.isLoading = true;
    this.form = new FormGroup({
     name: new FormControl(null, {
       validators: [Validators.required]
     }),
     capacity: new FormControl(null, {
       validators: [Validators.required]
     })
    });

  }
  /**addRect() {
    // prompt to get table number.
    const tableNumber = prompt("What is the table number?", "Please enter a table number.");

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
          guestsSeated: this.guestsSeated,
          timeSeated: this.timeSeated,
          notes: this.notes
        });
      };
    })(this.rectTable.toObject);

    // this.rectTable.name = tableNumber;


    // creates textbox
    this.textBox = new fabric.Textbox(this.rectTable.name, {
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
  **/

  saveTable() {
    if (this.form.invalid) {
      return;
    }
    // this.isLoading = true;
    // this.storesService.addtable(
        // this.form.value.name,
        // this.form.value.capacity
    // );
    this.isLoading = false;
    this.dialogRef.close();
    this.form.reset();

  }

  ngOnDestroy() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

