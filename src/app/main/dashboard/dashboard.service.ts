import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class DashboardService {

  selectedStoreID = "None";

  constructor(
    private router: Router
  ) {}

  dashLoadCanvas (floorplanID: string) {
    console.log("hi");
  }
}
