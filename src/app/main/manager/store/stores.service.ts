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
  private stores: Store[] = [];
  private storesUpdated = new Subject<{
    stores: Store[];
    storeCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getStores(storesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${storesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; stores: any; maxStores: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(storeData => {
          return {
            stores: storeData.stores.map(store => {
              return {
                name: store.name,
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
      creator: string;
    }>(BACKEND_URL + id);
  }

  addStore(name: string) {
    const storeData: Store = {
      id: null,
      name: name,
      creator: null
    };
    this.http
      .post<{ message: string; store: Store }>(BACKEND_URL, storeData)
      .subscribe(responseData => {
        this.router.navigate(["/main/manager"]);
      });
  }

  updateStore(id: string, name: string) {
    let storeData: Store;
    storeData = {
      id: id,
      name: name,
      creator: null
    };
    this.http.put(BACKEND_URL + id, storeData).subscribe(response => {
      this.router.navigate(["/main/manager"]);
    });
  }

  deleteStore(storeId: string) {
    return this.http.delete(BACKEND_URL + storeId);
  }
}
