import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../../environments/environment";
import { Floorplan } from "./floorplan.model";
import { identifierModuleUrl } from "@angular/compiler";


const BACKEND_URL = environment.apiUrl + "/floorplans/";

@Injectable({ providedIn: "root" })
export class FloorplansService {
  private floorplans: Floorplan[] = [];
  private floorplansUpdated = new Subject<{
    floorplans: Floorplan[];
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getFloorplans() {
    this.http
      .get<{ message: string; floorplans: any; }>(
        BACKEND_URL
      )
      .pipe(
        map(floorplanData => {
          return {
            floorplans: floorplanData.floorplans.map(floorplan => {
              return {
                name: floorplan.name,
                json: floorplan.json,
                id: floorplan._id,
                creator: floorplan.creator,
                storeId: floorplan.storeId
              };
            })

          };
        })
      )
      .subscribe(transformedFloorplanData => {
        this.floorplans = transformedFloorplanData.floorplans;
        this.floorplansUpdated.next({
          floorplans: [...this.floorplans],
          // floorplanCount: transformedFloorplanData.maxFloorplans
        });
      });
  }

  getFloorplanUpdateListener() {
    return this.floorplansUpdated.asObservable();
  }

  getFloorplan(id: string) {
 // getFloorplan(id: string) {
 // Brett here; added storeId for multiple floorplans per store
    return this.http.get<{
      _id: string;
      name: string;
      json: JSON;
      creator: string;
      storeId: string;
    }>(BACKEND_URL + id);
  }

  addFloorplan(
    name: string,
    json: JSON,
    storeId: string
  ) {

    const floorplanData: Floorplan = {
      id: null,
      name: name,
      json: json,
      creator: null,
      storeId: storeId
    };
    this.http
      .post<{message: string; floorplan: Floorplan }>(
        BACKEND_URL,
        floorplanData
      )
      .subscribe(responseData => {
        // this.router.navigate(["/main/dashboard"]);
      });
  }

  updateFloorplan(
    id: string,
    name: string,
    json: JSON,
    storeId: string
  ) {
    let floorplanData: Floorplan;
    floorplanData = {
      id: id,
      name: name,
      json: json,
      creator: null,
      storeId: storeId
    };
    console.log("BACKEND_URL: " + BACKEND_URL + " | id: " + id);
    this.http.put(BACKEND_URL + id, floorplanData).subscribe(response => {
      // this.router.navigate(["/main/reservations"]);
    });
  }




  deleteFloorplans(floorplanId: string) {
    return this.http.delete(BACKEND_URL + floorplanId);
  }
}
