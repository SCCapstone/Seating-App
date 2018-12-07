import { Component, OnInit } from "@angular/core";
import "fabric";
import { $ } from "protractor";
import { getNumberOfCurrencyDigits } from "@angular/common";

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



  constructor() {}

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec  = document.getElementById("canvas-wrap");
    this.canvas.setHeight(canvasSpec.clientHeight - 50);
    this.canvas.setWidth(canvasSpec.clientWidth);
  }

  // Add a rectangle object to the canvas
  addRect() {
    // prompt to get party size
    const partySize = prompt("What is the party size?", "Please enter a number");
    // creates rectangle
    this.rectTable = new fabric.Rect({
      width: 100,
      height: 100,
      fill: "purple",
      originX: "center",
      originY: "center",
    });
    // creates textbox
    this.textBox = new fabric.Textbox(partySize, {
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
    const partySize = prompt("What is the party size?", "Please enter a number");
    // creates circle
    this.circleTable = new fabric.Circle({
      radius: 75,
      fill: "purple",
      originX: "center",
      originY: "center",
    });
    // creates textbox
    this.textBox = new fabric.Textbox(partySize, {
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
