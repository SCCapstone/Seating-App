import { Component, OnInit, setTestabilityGetter, OnDestroy } from '@angular/core';
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
export class CanvasComponent implements OnInit, OnDestroy {
  private canvas;

  selectedFloorplanID = "None";
  floorplan: Floorplan;
  floorplanList: Floorplan[] = [];
  private mode = "create";
  private floorplanId: string;
  private floorplansSub: Subscription;
  private authStatusSub: Subscription;
  private updateSub: Subscription;

  totalFloorplans = 0;

  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public dashboardService: DashboardService,
    public floorplansService: FloorplansService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.dashboardService.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec  = document.getElementById("canvas-wrap");
    this.dashboardService.canvas.setHeight(canvasSpec.clientHeight);
    this.dashboardService.canvas.setWidth(canvasSpec.clientWidth);

    this.updateSub = this.dashboardService.fpChange.subscribe(changedFPID => {
      this.loadCanvas(changedFPID);
    });

    this.dashboardService.canvas.on("mouse:down", (options) => {
      if (options.target) {
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
    console.log("Table " + options.target._objects[0].name + " selected.");
    // this.dashboardService.selectedTable = options;
    this.dashboardService.dashSetTable(options);
  }


  loadCanvas(id: string) {
    // Currently prompts user for name. **TODO
    console.log("Loading Floorplan with ID: " + id);

    this.floorplansService.getFloorplan(id).subscribe(floorplanData => {
      this.floorplan = {
        id: floorplanData._id,
        name: floorplanData.name,
        json: floorplanData.json,
        creator: floorplanData.creator,
        storeId: floorplanData.storeId
      };
      // this.selectedFloorplanID = floorplanData._id;
      this.dashboardService.canvas.loadFromJSON(this.floorplan.json);
      this.dashboardService.dashUpdateTables();
    });
  }

  updateCanvas() {
    console.log("you did it");
/*     const json_data = this.dashboardService.canvas.toJSON();
    console.log("Argument ID: " + this.floorplan.id);
    this.dashboardService.updateFloorplan(
      this.floorplan.id,
      this.floorplan.name,
      json_data
    ); */
  }

  ngOnDestroy() {
    this.updateSub.unsubscribe();
  }
}

