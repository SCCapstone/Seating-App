import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../../environments/environment";
import { Store } from "./store.model";

const BACKEND_URL = environment.apiUrl + "/stores/";

@Injectable({ providedIn: "root" })
export class StoresService {
  storeToUpdate = "none";
  private stores: Store[] = [];
  private storesUpdated = new Subject<{
    stores: Store[];
    storeCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getStores() {
    this.http
      .get<{ message: string; stores: any; maxStores: number }>(
        BACKEND_URL
      )
      .pipe(
        map(storeData => {
          return {
            stores: storeData.stores.map(store => {
              return {
                name: store.name,
                defaultFloorplan: store.defaultFloorplan,
                id: store._id,
                creator: store.creator
              };
            }),
            maxStores: storeData.maxStores
          };
        })
      )
      .subscribe(transformedStoreData => {
        this.stores = transformedStoreData.stores;
        this.storesUpdated.next({
          stores: [...this.stores],
          storeCount: transformedStoreData.maxStores
        });
      });
  }

  getStoreUpdateListener() {
    return this.storesUpdated.asObservable();
  }

  getStore(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      defaultFloorplan: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addStore(name: string, FloorplanID: string) {
    const storeData: Store = {
      id: null,
      name: name,
      defaultFloorplan: FloorplanID,
      creator: null
    };
    return this.http
      .post<{ message: string; store: Store }>(BACKEND_URL, storeData);
  }

  updateStore(id: string, name: string, FloorplanID: string) {
    let storeData: Store;
    storeData = {
      id: id,
      name: name,
      defaultFloorplan: FloorplanID,
      creator: null
    };
    return this.http.put(BACKEND_URL + id, storeData);
  }

  deleteStore(storeId: string) {
    return this.http.delete(BACKEND_URL + storeId);
  }

  setStoreToEdit(id: string) {
    this.storeToUpdate = id;
  }
  getStoreToEdit() {
    return this.storeToUpdate;
  }
}
