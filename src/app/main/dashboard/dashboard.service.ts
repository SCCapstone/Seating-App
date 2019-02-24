import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class DashboardService {

  selectedStoreID = "None";
  selectedFloorplanName = "None";
  selectedFloorplanID = "None";

  constructor(
    private router: Router
  ) {}

  dashLoadCanvas () {
    console.log("Dashboard: \n" + this.selectedStoreID, "\n", this.selectedFloorplanID, this.selectedFloorplanName);
  }
}
