import { Component, OnInit } from "@angular/core";
import "fabric";
import { $ } from "protractor";

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

  constructor() {}

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas", {});


  }

  // Add a rectangle object to the canvas
  addRect() {
    this.rectTable = new fabric.Rect({
      // top: 100,
      // left: 0,
      width: 100,
      height: 100,
      fill: "red"
    });
    this.canvas.add(this.rectTable);
    this.canvas.centerObject(this.rectTable);
  }

  // Add a circle object to the canvas
  addCircle() {
    this.circleTable = new fabric.Circle({
      // top: 25,
      // left: 100,
      radius: 75,
      fill: "blue"
    });
    this.canvas.add(this.circleTable);
    this.canvas.centerObject(this.circleTable);
  }
}
