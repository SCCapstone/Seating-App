import { Component, OnInit } from '@angular/core';
import "fabric";

declare let fabric;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  private canvas;
  private blueRect;
  private redRect;

  constructor() { }

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas", {
    });

    this.redRect = new fabric.Rect({
      width: 200,
      height: 200,
      fill: "red"
    });

    this.blueRect = new fabric.Rect({
      width: 200,
      height: 200,
      fill: "blue"
    });

    this.canvas.add(this.redRect);
    this.canvas.add(this.blueRect);
    this.canvas.centerObject(this.blueRect);
  }
}
