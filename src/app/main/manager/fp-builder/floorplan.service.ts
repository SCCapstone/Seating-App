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

  private floorplanToEdit;

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
    return this.http
      .post<{message: string; floorplan: Floorplan }>(
        BACKEND_URL,
        floorplanData
      );
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
    return this.http.put(BACKEND_URL + id, floorplanData);
  }

  deleteFloorplans(floorplanId: string) {
    return this.http.delete(BACKEND_URL + floorplanId);
  }

  /**
   * Sets the floorplan that is to be edited.
   * @param fp the floorplan that is to be edited
   */
  setFloorplanToEdit(fp: string) {
    this.floorplanToEdit = fp;
  }

  /**
   * Returns the floorplan that is to be edited.
   */
  getFloorplanToEdit() {
    return this.floorplanToEdit;
  }

  // Deletes all floorplans associated with store upon deletion
  deleteStoreFloorplans(storeId: string) {
    console.log("Deleting Floorplans...");
    this.floorplans.forEach(floorplan => {
      if (floorplan.storeId === storeId) {
        console.log("Deleted: " + floorplan.name);
        this.deleteFloorplans(floorplan.id).subscribe(
          () => {
            this.getFloorplans();
          }
        );
      }
    });
  }
}
