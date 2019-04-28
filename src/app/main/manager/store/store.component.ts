import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { FloorplansService } from "../../manager/fp-builder/floorplan.service";
import { Floorplan } from "../../manager/fp-builder/floorplan.model";
import { StoresService } from "./stores.service";
import { Store } from "./store.model";
import { ServersService } from "../../manager/servers/servers.service";
import { AuthService } from "../../../auth/auth.service";
import { TouchSequence } from "selenium-webdriver";
import { stringify } from "@angular/core/src/render3/util";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.css"]
})
export class StoreComponent implements OnInit, OnDestroy {
  editStoreID = "none";
  stores: Store[] = [];
  isLoading = false;
  totalStores = 0;
  userIsAuthenticated = false;
  userId: string;
  private storesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public storesService: StoresService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.storesService.getStores();
    this.userId = this.authService.getUserId();
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[] }) => {
        this.isLoading = false;
        this.stores = storeData.stores;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.storesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  openAddStore(): void {
    const dialogRef = this.dialog.open(StoreAddComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  openEditStore(id: string): void {
    this.storesService.setStoreToEdit(id);
    const dialogRef = this.dialog.open(StoreEditComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}

@Component({
  selector: "app-store-add",
  templateUrl: "store-add.component.html",
  styleUrls: ["./store.component.css"]
})
export class StoreAddComponent implements OnInit, OnDestroy {
  enteredName = "";
  store: Store;
  isLoading = false;
  form: FormGroup;
  userIsAuthenticated = false;
  userId: string;

  totalFloorplans = 0;
  floorplanList: Floorplan[] = [];

  private storeId: string;
  private floorplanId: string;
  private floorplansSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<StoreAddComponent>,
    public storesService: StoresService,
    public floorplansService: FloorplansService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
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
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.storeId = null;
  }

  /**
   * Saves a new store to the database. Sets the floorplan value to null,
   * since stores should be created before floorplans.
   */
  onSaveStore() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.storesService.addStore(this.form.value.name, null).subscribe(() => {
      this.storesService.getStores();
    });
    this.isLoading = false;
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-store-edit",
  templateUrl: "store-edit.component.html",
  styleUrls: ["./store.component.css"]
})
export class StoreEditComponent implements OnInit, OnDestroy {
  storeToEdit = "none";
  enteredName = "";
  store: Store;
  isLoading = false;
  form: FormGroup;
  userIsAuthenticated = false;
  userId: string;

  totalFloorplans = 0;
  floorplanList: Floorplan[] = [];

  private floorplanId: string;
  private floorplansSub: Subscription;

  private mode = "edit";
  private storeId: string;
  private authStatusSub: Subscription;
  constructor(
    public dialogRef: MatDialogRef<StoreEditComponent>,
    public storesService: StoresService,
    public floorplansService: FloorplansService,
    public serversService: ServersService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.storeToEdit = this.storesService.getStoreToEdit();
    console.log(this.storeToEdit);
    this.storeId = this.storeToEdit;
    this.isLoading = true;
    this.storesService.getStore(this.storeId).subscribe(storeData => {
      this.isLoading = false;
      this.store = {
        id: storeData._id,
        name: storeData.name,
        defaultFloorplan: storeData.defaultFloorplan,
        creator: storeData.creator
      };

      console.log(
        "setting default floorplan in form to: " + this.store.defaultFloorplan
      );
      this.form.setValue({
        name: this.store.name,
        defaultFloorplan: this.store.defaultFloorplan
      });
    });
    this.userId = this.authService.getUserId();
    this.floorplansService.getFloorplans();
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
          this.floorplanList = this.floorplanList.filter(
            fp => fp.storeId === this.storeToEdit
          );
          if (this.floorplanList.length === 0) {
            this.form.controls.defaultFloorplan.disable();
          }
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      defaultFloorplan: new FormControl(null, {})
    });
  }

  onUpdateStore() {
    if (this.form.invalid) {
      return;
    }
    this.storeId = this.storeToEdit;
    this.isLoading = true;
    this.storesService
      .updateStore(
        this.storeId,
        this.form.value.name,
        this.form.value.defaultFloorplan
      )
      .subscribe(() => {
        this.storesService.getStores();
      });
    this.isLoading = false;
    this.form.reset();
    this.dialogRef.close();
  }

  onDelete() {
    this.isLoading = true;
    this.serversService.deleteStoreServers(this.storeToEdit);
    this.floorplansService.deleteStoreFloorplans(this.storeToEdit);
    this.storesService.deleteStore(this.storeToEdit).subscribe(() => {
      this.storesService.getStores();
      this.dialogRef.close();
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
