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
      .subscribe(
        (storeData: {
          stores: Store[];
        }) => {
          this.isLoading = false;
          this.stores = storeData.stores;
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
  enteredDefaultFloorplan = "";
  store: Store;
  isLoading = false;
  form: FormGroup;
  userIsAuthenticated = false;
  userId: string;

  selectedFloorplan = "None";
  selectedFloorplanID = "None";
  totalFloorplans = 0;
  floorplan: Floorplan;
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

  setDefaultFloorplan(name: string, id: string) {
    this.selectedFloorplan = name;
    this.selectedFloorplanID = id;
  }

  onSaveStore() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.storesService.addStore(
      this.form.value.name,
      this.selectedFloorplanID
    ).subscribe(
      () => {
        this.storesService.getStores();
      }
    );
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
  enteredDefaultFloorplan = "";
  store: Store;
  isLoading = false;
  form: FormGroup;
  userIsAuthenticated = false;
  userId: string;

  selectedFloorplan = "None";
  selectedFloorplanID = "None";
  totalFloorplans = 0;
  floorplan: Floorplan;
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
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.storeToEdit = this.storesService.getStoreToEdit();
    console.log(this.storeToEdit);
    this.storeId = this.storeToEdit;
    this.isLoading = true;
    this.storesService
      .getStore(this.storeId)
      .subscribe(storeData => {
        this.isLoading = false;
        this.store = {
          id: storeData._id,
          name: storeData.name,
          defaultFloorplan: storeData.defaultFloorplan,
          creator: storeData.creator
        };
        this.selectedFloorplanID = this.store.defaultFloorplan;
        console.log("getStore: " + this.selectedFloorplanID);
        this.form.setValue({
          name: this.store.name
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
  }

  setDefaultFloorplan(name: string, floorplanID: string) {
    this.selectedFloorplan = name;
    this.selectedFloorplanID = floorplanID;
  }

  onUpdateStore() {
    if (this.form.invalid) {
      return;
    }
    this.storeId = this.storeToEdit;
    this.isLoading = true;
      this.storesService.updateStore(
        this.storeId,
        this.form.value.name,
        this.selectedFloorplanID
    ).subscribe(
      () => {
        this.storesService.getStores();
      }
    );
    this.isLoading = false;
    this.form.reset();
    this.dialogRef.close();
  }

  onDelete() {
    this.isLoading = true;
    this.storesService.deleteStore(this.storeToEdit).subscribe(
      () => {
        this.storesService.getStores();
        this.dialogRef.close();
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
