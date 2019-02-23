import { Component, OnInit } from '@angular/core';
import "fabric";
import { $ } from "protractor";
import { getNumberOfCurrencyDigits } from "@angular/common";
import { Canvas } from "fabric/fabric-impl";
import { FloorplansService } from "../../manager/fp-builder/floorplan.service";
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Floorplan } from '../../manager/fp-builder/floorplan.model';

declare let fabric;

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"]
})
export class CanvasComponent implements OnInit {
  private canvas;
  private rectTable;
  private circleTable;
  private textBox;

  floorplan: Floorplan;
  floorplanList: Floorplan[] = [];
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
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

/**
 * Creates a rectangle table object and places it in the center of the canvas.
 */
  addRect() {
    // prompt to get table number.
    const tableNumber = prompt("What is the table number?", "Please enter a table number.");

    // creates rectangle object
    this.rectTable = new fabric.Rect({
      width: 100,
      height: 100,
      fill: "purple",
      originX: "center",
      originY: "center",
    });

    // creates textbox
    this.textBox = new fabric.Textbox(tableNumber, {
      originX: "center",
      originY: "center",
      fontSize: 64
    });

    // groups them together
    const group = new fabric.Group([this.rectTable, this.textBox ], {
      top: 100,
      left: 150
    });
    this.canvas.add(group);
    this.canvas.centerObject(group);
  }

  // Add a circle object to the canvas
  addCircle() {
    // prompt to get party size
    const tableNumber = prompt("What is the table number?", "Please enter a table number.");
    // creates circle
    this.circleTable = new fabric.Circle({
      radius: 75,
      fill: "purple",
      originX: "center",
      originY: "center",
    });
    // creates textbox
    this.textBox = new fabric.Textbox(tableNumber, {
      originX: "center",
      originY: "center",
      fontSize: 64,
      fontColor: "white"
    });
   // groups them together
    const group = new fabric.Group([this.circleTable, this.textBox ], {
      top: 100,
      left: 150
    });
    this.canvas.add(group);
    this.canvas.centerObject(group);
  }

  // Delete the selected object
  discardObject() {
    this.canvas.remove(this.canvas.getActiveObject());
  }

  // Lock object in place
  toggleLockObject() {
    if ((this.canvas.getActiveObject()).lockMovementX === false) {
      (this.canvas.getActiveObject()).lockMovementX = true;
      (this.canvas.getActiveObject()).lockMovementX = true;
      (this.canvas.getActiveObject()).lockMovementY = true;
      (this.canvas.getActiveObject()).lockScalingX = true;
      (this.canvas.getActiveObject()).lockScalingY = true;
      (this.canvas.getActiveObject()).lockUniScaling = true;
      (this.canvas.getActiveObject()).lockRotation = true;
    } else {
      (this.canvas.getActiveObject()).lockMovementX = false;
      (this.canvas.getActiveObject()).lockMovementX = false;
      (this.canvas.getActiveObject()).lockMovementY = false;
      (this.canvas.getActiveObject()).lockScalingX = false;
      (this.canvas.getActiveObject()).lockScalingY = false;
      (this.canvas.getActiveObject()).lockUniScaling = false;
      (this.canvas.getActiveObject()).lockRotation = false;
    }
  }

  /**
   * Saves what is currently on the canvas to JSON data, and outputs onto console
  */
  saveCanvas() {
    // const json_data = JSON.stringify(this.canvas.toJSON());
    const json_data = this.canvas.toJSON();
    const fpName = prompt("Enter name for floorplan", "");

    this.floorplansService.addFloorplan(fpName, json_data);

    /**
    if (this.mode === "create") {
      this.floorplansService.addFloorplan(
        json_data
      );
    } else {
      this.floorplansService.updateFloorplan(
        this.floorplanId,
        json_data
      );
    }
    */

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
      this.canvas.loadFromJSON(this.floorplan.json);
    });
    // Redraws the canvas.
    this.canvas.renderAll();
  }
  /*
  // makes a textbox
  addTextBox() {
    this.textBox = new fabric.Textbox("Add Party Info", {
      width: 100,
      height: 100,
      fontSize: 16,
      textBackgroundColor: "purple",
      cornerStyle: "circle",
      textAlign: "center"
    });
    this.canvas.add(this.textBox);
    this.canvas.centerObject(this.textBox);

  }
  */
}

