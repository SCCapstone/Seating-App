import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../../environments/environment";
import { Floorplan } from "./floorplan.model";


const BACKEND_URL = environment.apiUrl + "/floorplans/";

@Injectable({ providedIn: "root" })
export class FloorplansService {
  private floorplans: Floorplan[] = [];
  private floorplansUpdated = new Subject<{
    floorplans: Floorplan[];
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getFloorplanUpdateListener() {
    return this.floorplansUpdated.asObservable();
  }

  getFloorplan(id: string) {
 // getFloorplan(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      json: JSON;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addFloorplan(
    name: string,
    json: JSON
  ) {

    const floorplanData: Floorplan = {
      id: null,
      name: name,
      json: json,
      creator: null
    };
    this.http
      .post<{message: string; floorplan: Floorplan }>(
        BACKEND_URL,
        floorplanData
      )
      .subscribe(responseData => {
        this.router.navigate(["/main/dashboard"]);
      });
  }

  updateFloorplan(
    id: string,
    name: string,
    json: JSON
  ) {
    let floorplanData: Floorplan;
    floorplanData = {
      id: id,
      name: name,
      json: json,
      creator: null
    };
  }



  deleteFloorplans(floorplanId: string) {
    return this.http.delete(BACKEND_URL + floorplanId);
  }
}
