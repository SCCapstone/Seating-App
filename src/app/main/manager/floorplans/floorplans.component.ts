import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { FpBuilderCreateComponent } from '../fp-builder/fp-builder-create/fp-builder-create.component';
import { FpBuilderEditComponent} from "../fp-builder/fp-builder-edit/fp-builder-edit.component";
import { FloorplansService } from '../fp-builder/floorplan.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Floorplan } from '../fp-builder/floorplan.model';
import { Subscription } from 'rxjs';

import { StoresService } from "../store/stores.service";
import { Store } from "../store/store.model";
import { WelcomeService } from '../../welcome/welcome.service';


@Component({
  selector: 'app-floorplans',
  templateUrl: './floorplans.component.html',
  styleUrls: ['./floorplans.component.css']
})
export class FloorplansComponent implements OnInit {

  floorplanList: Floorplan[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private floorplansSub: Subscription;
  private authStatusSub: Subscription;

  selectedStoreID: string;
  selectedStoreName = "Select a Store";
  storeList: Store[] = [];
  private storesSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public floorplansService: FloorplansService,
    public welcomeService: WelcomeService,
    private authService: AuthService,
    private storesService: StoresService
  ) {}

  ngOnInit() {
    this.floorplansService.getFloorplans();
    this.userId = this.authService.getUserId();
    this.floorplansSub = this.floorplansService
      .getFloorplanUpdateListener()
      .subscribe(
        (floorplanData: {
          floorplans: Floorplan[];
        }) => {
          this.isLoading = false;
          this.floorplanList = floorplanData.floorplans;
        }
      );
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
      this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[]; storeCount: number }) => {
        this.isLoading = false;
        this.storeList = storeData.stores;
      });
      if (this.welcomeService.selectedStoreID != null) {
        this.selectedStoreID = this.welcomeService.selectedStoreID;
        this.selectedStoreName = this.welcomeService.selectedStoreName;
      }
  }

  /**
   * This function sets the selected store class variable
   * @param store store to be selected
   */
  selectStore(storeID: string, storeName: string) {
    this.selectedStoreID = storeID;
    this.selectedStoreName = storeName;
  }

  openCreateFloorplan(): void {
    const dialogRef = this.dialog.open(FpBuilderCreateComponent, {
      width: "80vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  openEditFloorplan(id: string) {
    this.floorplansService.setFloorplanToEdit(id);
    const dialogRef = this.dialog.open(FpBuilderEditComponent, {
      width: "80vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  deleteFloorplan(id: string) {
    // Currently prompts user for name. **TODO
    console.log("Deleting Floorplan with ID: " + id);
    this.floorplansService.deleteFloorplans(id)
      .subscribe(() => {
        console.log("Deleted!");
      });
  }
}
