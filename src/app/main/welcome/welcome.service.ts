import { Injectable } from '@angular/core';

import { DashboardService } from '../dashboard/dashboard.service';

import { FloorplansService } from '../manager/fp-builder/floorplan.service';
import { Floorplan } from '../manager/fp-builder/floorplan.model';

import { MatDialog } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class WelcomeService {
  // Default Store helpers
  isLoading = false;
  justLogin = false;

  // Set by login welcome OR a selector(not done yet)
  selectedStoreName = null;
  selectedStoreID = null;
  selectedFloorplanID = null;

  floorplan: Floorplan;
  floorplanList: Floorplan[] = [];

  constructor(
    private dashboardService: DashboardService,
    private floorplansService: FloorplansService,
    public dialog: MatDialog
  ) {}

    /** Eddie's Loading a Default Store Method */
    loadDefaultStore(storeName: string, storeID: string, floorplanID: string) {
      this.justLogin = true;
      this.selectedStoreName = storeName;
      this.selectedStoreID = storeID;
      this.selectedFloorplanID = floorplanID;
      this.dashboardService.selectedStoreID = this.selectedStoreID;
      this.loadDashboard();
      this.justLogin = false;
    }

    loadDashboard() {
      this.isLoading = true;
      this.dashboardService.dashSetTable(null);
      this.floorplansService.getFloorplan(this.selectedFloorplanID).subscribe(floorplanData => {
        this.floorplan = {
          id: floorplanData._id,
          name: floorplanData.name,
          json: floorplanData.json,
          creator: floorplanData.creator,
          storeId: floorplanData.storeId
        };
        this.dashboardService.dashLoadCanvas(
          floorplanData._id,
          floorplanData.name,
          floorplanData.json,
          floorplanData.storeId
        );
      });
      this.isLoading = false;
    }

    // Getter for login handle
    getJustLogin() {
      return this.justLogin;
    }

    // Getter for checking if default store has been set
    defaultStoreCheck() {
      return (this.selectedStoreID === null);
    }

    /**
     * Returns the name of the currently selected store.
     * Used for side-store panel.
     */
    getStoreName() {
      return this.selectedStoreName;
    }

    clear() {
      this.selectedStoreName = null;
      this.selectedStoreID = null;
      this.selectedFloorplanID = null;
    }
}
