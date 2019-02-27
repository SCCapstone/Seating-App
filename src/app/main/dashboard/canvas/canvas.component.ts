import { Component, OnInit, setTestabilityGetter } from '@angular/core';
import "fabric";
import { getNumberOfCurrencyDigits } from "@angular/common";
import { Canvas } from "fabric/fabric-impl";
import { FloorplansService } from "../../manager/fp-builder/floorplan.service";
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Floorplan } from '../../manager/fp-builder/floorplan.model';

import { DashboardService } from '../dashboard.service';

declare let fabric;

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"]
})
export class CanvasComponent implements OnInit {
  private canvas;

  selectedFloorplanID = "None";
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

  changedFPID = "None";

  constructor(
    public dashboardService: DashboardService,
    public floorplansService: FloorplansService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec  = document.getElementById("canvas-wrap");
    this.canvas.setHeight(canvasSpec.clientHeight);
    this.canvas.setWidth(canvasSpec.clientWidth);

    this.dashboardService.change.subscribe(changedFPID => {
      this.changedFPID = changedFPID;
      this.loadCanvas(this.changedFPID);
    });

    this.canvas.on("mouse:down", (options) => {
      if (options.target) {
        console.log("Table selected", options.target);
        options.target.lockMovementX = true;
        options.target.lockMovementY = true;
        options.target.lockScalingX = true;
        options.target.lockScalingY = true;
        options.target.lockRotation = true;
        options.target.hasControls = false;
        this.setTable(options);
      }
    });
  }

  setTable(options) {
    console.log("You just selected table " + options.target._objects[0].name + " IN ANOTHER FUNCTION!!!");
    this.dashboardService.selectedTable = options;
    this.dashboardService.dashSetTable();
  }


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
      this.selectedFloorplanID = floorplanData._id;
      this.canvas.loadFromJSON(this.floorplan.json);
    });
  }

  updateCanvas() {
    console.log("Hey you did it");
/*     const json_data = this.canvas.toJSON();
    console.log("Argument ID: " + this.floorplan.id);
    this.dashboardService.updateFloorplan(
      this.floorplan.id,
      this.floorplan.name,
      json_data
    ); */
  }
}

