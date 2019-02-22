import { Component, OnInit } from '@angular/core';
import "fabric";
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

import { FloorplansService } from "../../manager/fp-builder/floorplan.service";
import { StoresService } from "../../manager/store/stores.service";
import { ServersService } from "../../manager/servers/servers.service";
import { Floorplan } from '../../manager/fp-builder/floorplan.model';
import { Store } from '../../manager/store/store.model';
import { Server } from "../../manager/servers/server.model";

declare let fabric;

@Component({
  selector: 'app-side-store',
  templateUrl: './side-store.component.html',
  styleUrls: ['./side-store.component.css']
})
export class SideStoreComponent implements OnInit {
  private canvas;
  private rectTable;
  private circleTable;
  private textBox;

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
  selectedStore = "None"; //store name
  selectedStoreID = "None"; //hold store Id
  totalStores = 0;
  storesPerPage = 10;
  currentPage = 1;
  // needed for DB function ^

  servers: Server;
  serverList: Server[] = [];
  selectedServers: "None";
  totalServers = 0;
  serversPerPage = 10;

  totalFloorplans = 0;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public floorplansService: FloorplansService,
    public storesService: StoresService,
    public serversService: ServersService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() { // on load component
    this.isLoading = true;
    this.floorplansService.getFloorplans();
    this.userId = this.authService.getUserId();
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
    this.storesService.getStores(this.storesPerPage, this.currentPage);
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
    this.serversService.getServers(this.serversPerPage, this.currentPage);
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
    this.canvas = new fabric.Canvas("canvas", {});
    const canvasSpec  = document.getElementById("canvas-wrap");
    this.canvas.setHeight(canvasSpec.clientHeight - 50);
    this.canvas.setWidth(canvasSpec.clientWidth);
  }

  loadStore(name: string, floorplanID: string) {
    this.isLoading = true;
    this.selectedStore = name;
    this.loadCanvas(floorplanID);
    this.isLoading = false;
  }

  loadDefaultFloorplan(id: string) {
    console.log("Loading default floorplan with ID: " + id);
    this.storesService.getStore(id).subscribe(storeData => {
      this.store = {
        id: storeData._id,
        name: storeData.name,
        defaultFloorplan: storeData.defaultFloorplan,
        creator: storeData.creator
      };
      this.selectedStore = storeData.name;
    });
  }

  loadCanvas(id: string) {
    // Currently prompts user for name. **TODO
    console.log("Loading Floorplan with ID: " + id);

    this.floorplansService.getFloorplan(id).subscribe(floorplanData => {
      this.floorplan = {
        id: floorplanData._id,
        name: floorplanData.name,
        json: floorplanData.json,
        creator: floorplanData.creator
      };
      this.selectedFloorplan = floorplanData.name;
      this.canvas.loadFromJSON(this.floorplan.json);
    });

    this.serversService.getServer(id).subscribe(serverData => {
      this.servers = {
        id: serverData._id,
        name: serverData.name,
        store: this.servers.store,
        creator: serverData.creator
      };
     // this.selectedServers = serverData.name;
    });
    // Redraws the canvas.
    this.canvas.renderAll();
  }
}
