import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from "@angular/material";

import { FloorplansService } from "../../manager/fp-builder/floorplan.service";
import { StoresService } from "../../manager/store/stores.service";
import { ServersService } from "../../manager/servers/servers.service";
import { Floorplan } from '../../manager/fp-builder/floorplan.model';
import { Store } from '../../manager/store/store.model';
import { Server } from "../../manager/servers/server.model";
import { DashboardService } from '../dashboard.service';
import { WelcomeComponent } from "../../welcome/welcome.component";
import { WelcomeService } from '../../welcome/welcome.service';



@Component({
  selector: 'app-side-store',
  templateUrl: './side-store.component.html',
  styleUrls: ['./side-store.component.css']
})
export class SideStoreComponent implements OnInit {

  floorplan: Floorplan;
  floorplanList: Floorplan[] = [];
  selectedFloorplan = "None";
  private mode = "create";
  private floorplanId: string;
  private floorplansSub: Subscription;
  private storesSub: Subscription; // subscriptions hold changes to objects
  private serversSub: Subscription;
  private authStatusSub: Subscription;

  store: Store;
  storeList: Store[] = [];
  defaultFloorplan: string;
  selectedStore = "None"; // store name
  selectedStoreID = "None"; // hold store Id
  totalStores = 0;


  servers: Server;
  serverList: Server[] = [];
  selectedServers: "None";
  totalServers = 0;

  totalFloorplans = 0;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public dialog: MatDialog,
    public dashboardService: DashboardService,
    public floorplansService: FloorplansService,
    public storesService: StoresService,
    public serversService: ServersService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public welcomeService: WelcomeService
  ) {}

  ngOnInit() { // on load component
    this.isLoading = true;
    this.floorplansService.getFloorplans();
    this.userId = this.authService.getUserId();
    // Floorplans
    this.floorplansSub = this.floorplansService
      .getFloorplanUpdateListener()
      .subscribe(
        (floorplanData: {
          floorplans: Floorplan[];
          floorplanCount: number;
        }) => {
          this.isLoading = false;
          this.totalFloorplans = floorplanData.floorplanCount;
          this.floorplanList = floorplanData.floorplans;
        }
      );
    // Stores
    this.storesService.getStores();
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe(
        (storeData: {
          stores: Store[];
          storeCount: number;
        }) => {
          this.isLoading = false;
          this.totalStores = storeData.storeCount;
          this.storeList = storeData.stores;
        }
      );
      // Servers
    this.serversService.getServers();
    this.serversSub = this.serversService
    .getServerUpdateListener()
      .subscribe(
        (serverData: {
          servers: Server[];
          serverCount: number;
        }) => {
          this.isLoading = false;
          this.totalServers = serverData.serverCount;
          this.serverList = serverData.servers;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  loadStore(storeID: string, name: string, floorplanID: string) {
    this.isLoading = true;
    this.selectedStore = name;
    this.selectedStoreID = storeID;
    this.dashboardService.dashSetStore(storeID);
    this.loadCanvas(floorplanID);
    this.isLoading = false;
  }

  loadCanvas(floorplanId: string) {
    this.isLoading = true;

    this.dashboardService.dashSetTable(null);

    this.floorplansService.getFloorplan(floorplanId).subscribe(floorplanData => {
      this.floorplan = {
        id: floorplanData._id,
        name: floorplanData.name,
        json: floorplanData.json,
        creator: floorplanData.creator,
        storeId: floorplanData.storeId
      };
      this.selectedFloorplan = floorplanData.name;

      this.dashboardService.dashLoadCanvas(
        floorplanData._id,
        floorplanData.name,
        floorplanData.json,
        floorplanData.storeId
      );

    });
    this.isLoading = false;
  }

  openWelcomeModal(): void {
    const dialogRef = this.dialog.open(WelcomeComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}
