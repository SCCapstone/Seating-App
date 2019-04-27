import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ServersService } from "./servers.service";
import { Server } from "./server.model";
import { AuthService } from "../../../auth/auth.service";

import { StoresService } from "../store/stores.service";
import { Store } from "../store/store.model";
import { WelcomeService } from "../../welcome/welcome.service";

/**
 * Color data type for server colors. Includes a name and a hex code.
 */
export interface Color {
  name: string;
  hex: string;
}

@Component({
  selector: "app-servers",
  templateUrl: "./servers.component.html",
  styleUrls: ["./servers.component.css"]
})
export class ServersComponent implements OnInit, OnDestroy {
  editServerID = "none";
  servers: Server[] = [];
  isLoading = false;
  totalServers = 0;
  userIsAuthenticated = false;
  userId: string;
  private serversSub: Subscription;
  private authStatusSub: Subscription;
  private storesSub: Subscription;
  selectedStoreID: string;
  selectedStoreName = "Select a Store";
  storeList: Store[] = [];

  constructor(
    public dialog: MatDialog,
    public serversService: ServersService,
    private authService: AuthService,
    private storesService: StoresService,
    public welcomeService: WelcomeService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.serversService.getServers();
    this.userId = this.authService.getUserId();
    this.serversSub = this.serversService
      .getServerUpdateListener()
      .subscribe((serverData: { servers: Server[] }) => {
        this.isLoading = false;
        this.servers = serverData.servers;
      });
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[]; storeCount: number }) => {
        this.isLoading = false;
        // this.totalStores = storeData.storeCount;
        this.storeList = storeData.stores;

        if (this.welcomeService.selectedStoreID != null) {
          this.selectedStoreID = this.welcomeService.selectedStoreID;
          this.selectedStoreName = this.welcomeService.selectedStoreName;
        }
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  /**
   * This function sets the selected store class variable
   * @param store store to be selected
   */
  selectStore(storeID: string, storeName: string) {
    this.selectedStoreID = storeID;
    this.selectedStoreName = storeName;
  }

  ngOnDestroy() {
    this.serversSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  openAddServer(): void {
    const dialogRef = this.dialog.open(ServersAddComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  openEditServer(id: string): void {
    this.serversService.setServerToEdit(id);
    const dialogRef = this.dialog.open(ServersEditComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}

@Component({
  selector: "app-servers-add",
  templateUrl: "servers-add.component.html",
  styleUrls: ["./servers.component.css"]
})
export class ServersAddComponent implements OnInit, OnDestroy {
  server: Server;
  isLoading = false;
  form: FormGroup;
  private serverId: string;
  private storeId: string;
  private storesSub: Subscription;
  private authStatusSub: Subscription;

  store: Store;
  storeList: Store[] = [];
  totalStores = 0;
  selectedStoreID: string;
  selectedStoreName = "Select a Store";

  userIsAuthenticated = false;
  userId: string;

  // The list of colors the user will be able to choose from when creating
  // a user.
  colors: Color[] = [
    { name: "Red", hex: "#FF0000" },
    { name: "Garnet", hex: "#73000A" },
    { name: "Orange", hex: "#FF8000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Lime", hex: "#B5E61D" },
    { name: "Green", hex: "#008000" },
    { name: "Cyan", hex: "#00D0D0" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Magenta", hex: "#D000D0" },
    { name: "Pink", hex: "#FF80C0" },
    { name: "Black", hex: "#202020" },
    { name: "Grey", hex: "#909090" }
  ];

  constructor(
    public dialogRef: MatDialogRef<ServersAddComponent>,
    public serversService: ServersService,
    public storesService: StoresService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public welcomeService: WelcomeService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.storesService.getStores();
    this.userId = this.authService.getUserId();
    // Subscribe to store updates.
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[]; storeCount: number }) => {
        this.isLoading = false;
        this.totalStores = storeData.storeCount;
        this.storeList = storeData.stores;
      });

    // Subscribe to auth updates.
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    // Build the form for creating a new server.
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      color: new FormControl(null, {
        validators: [Validators.required]
      }),
      store: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.serverId = null;

    // Sets selected store value if a store has been selected in the welcome
    // modal.
    if (this.welcomeService.selectedStoreID != null) {
      this.selectedStoreID = this.welcomeService.selectedStoreID;
      this.selectedStoreName = this.welcomeService.selectedStoreName;
      this.form.setValue({
        name: this.form.value.name,
        color: this.form.value.color,
        store: this.selectedStoreID
      });
    }
  }

  /**
   * Saves the server, provided the information is valid.
   */
  onSaveServer() {
    if (this.form.invalid) {
      return;
    }
    console.log("Server color: " + this.form.value.color);
    this.isLoading = true;
    this.serversService
      .addServer(
        this.form.value.name,
        this.form.value.color,
        this.form.value.store
      )
      .subscribe(() => {
        this.serversService.getServers();
      });
    this.isLoading = false;
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  // Closes the dialog.
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-servers-edit",
  templateUrl: "servers-edit.component.html",
  styleUrls: ["./servers.component.css"]
})
export class ServersEditComponent implements OnInit, OnDestroy {
  serverToEdit = "none";
  server: Server;
  isLoading = false;
  form: FormGroup;
  private mode = "edit";
  private serverId: string;
  private storeId: string;
  private storesSub: Subscription;
  private authStatusSub: Subscription;

  store: Store;
  storeList: Store[] = [];
  totalStores = 0;
  currentPage = 1;

  userIsAuthenticated = false;
  userId: string;

  // Color variable used for picking server color.
  colors: Color[] = [
    { name: "Red", hex: "#FF0000" },
    { name: "Garnet", hex: "#73000A" },
    { name: "Orange", hex: "#FF8000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Lime", hex: "#B5E61D" },
    { name: "Green", hex: "#008000" },
    { name: "Cyan", hex: "#00D0D0" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Magenta", hex: "#D000D0" },
    { name: "Pink", hex: "#FF80C0" },
    { name: "Black", hex: "#202020" },
    { name: "Grey", hex: "#909090" }
  ];

  constructor(
    public dialogRef: MatDialogRef<ServersEditComponent>,
    public serversService: ServersService,
    public storesService: StoresService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.serverToEdit = this.serversService.getServerToEdit();
    console.log("Editing Server: " + this.serverToEdit);
    // Subscribe to store updates.
    this.storesService.getStores();
    this.userId = this.authService.getUserId();
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[]; storeCount: number }) => {
        this.isLoading = false;
        this.totalStores = storeData.storeCount;
        this.storeList = storeData.stores;
      });
    // Subscribe to auth updates.
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    // Build form for editing server.
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      color: new FormControl(null, {
        validators: [Validators.required]
      }),
      store: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.serverId = this.serverToEdit;
    this.isLoading = true;
    this.serversService.getServer(this.serverId).subscribe(serverData => {
      this.isLoading = false;
      this.server = {
        id: serverData._id,
        name: serverData.name,
        color: serverData.color,
        store: serverData.store,
        creator: serverData.creator
      };
      this.form.setValue({
        name: this.server.name,
        color: this.server.color,
        store: this.server.store
      });
    });
  }

  /**
   * Updates the server, provided the information is valid.
   */
  onUpdateServer() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value.color);
    this.serverId = this.serverToEdit;
    this.isLoading = true;
    this.serversService
      .updateServer(
        this.serverId,
        this.form.value.name,
        this.form.value.color,
        this.form.value.store
      )
      .subscribe(() => {
        this.serversService.getServers();
      });
    console.log("Updated store: " + this.form.value.store);
    this.isLoading = false;
    this.dialogRef.close();
    this.form.reset();
  }

  /**
   * Deleted the selected server from the database.
   */
  onDelete() {
    this.isLoading = true;
    this.serversService.deleteServer(this.serverToEdit).subscribe(() => {
      this.serversService.getServers();
      this.isLoading = false;
      this.dialogRef.close();
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  // Closes the modal.
  onNoClick(): void {
    this.dialogRef.close();
  }
}
