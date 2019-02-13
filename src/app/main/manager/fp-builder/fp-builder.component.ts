import { Component, OnInit } from '@angular/core';
import "fabric";
import { $ } from "protractor";
import { getNumberOfCurrencyDigits } from "@angular/common";
import { Canvas } from "fabric/fabric-impl";

declare let fabric;

@Component({
  selector: 'app-fp-builder',
  templateUrl: './fp-builder.component.html',
  styleUrls: ['./fp-builder.component.css']
})
export class FpBuilderComponent implements OnInit {
  private canvas;
  private rectTable;
  private circleTable;
  private textBox;

  constructor() {}

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec  = document.getElementById("canvas-wrap");
    this.canvas.setHeight(canvasSpec.clientHeight - 50);
    this.canvas.setWidth(canvasSpec.clientWidth);
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
      fontSize: 64
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

    // This is where the json data will need to be put onto the server.
    console.log(json_data);
  }

  /**
   * Prompts the user for JSON data, and then places it on the canvas.
   */
  loadCanvas() {
    const json_data = prompt("Enter JSON data", "");
    this.canvas.loadFromJSON(json_data);

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

