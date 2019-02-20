import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { StoresService } from "./stores.service";
import { Store } from "./store.model";
import { AuthService } from "../../../auth/auth.service";

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
  storesPerPage = 10;
  currentPage = 1;
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
    this.storesService.getStores(
      this.storesPerPage,
      this.currentPage
    );
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
  store: Store;
  isLoading = false;
  form: FormGroup;
  private storeId: string;
  private authStatusSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<StoreAddComponent>,
    public storesService: StoresService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.storeId = null;
  }

  onSaveStore() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.storesService.addStore(
      this.form.value.name
    );
    this.isLoading = false;
    this.dialogRef.close();
    this.form.reset();
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
  private mode = "edit";
  private storeId: string;
  private authStatusSub: Subscription;
  constructor(
    public dialogRef: MatDialogRef<StoreEditComponent>,
    public storesService: StoresService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.storeToEdit = this.storesService.getStoreToEdit();
    console.log(this.storeToEdit);
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.storeId = this.storeToEdit;
    this.isLoading = true;
    this.storesService
      .getStore(this.storeId)
      .subscribe(storeData => {
        this.isLoading = false;
        this.store = {
          id: storeData._id,
          name: storeData.name,
          creator: storeData.creator
        };
        this.form.setValue({
          name: this.store.name
        });
      });
  }

  onUpdateStore() {
    if (this.form.invalid) {
      return;
    }
    this.storeId = this.storeToEdit;
    this.isLoading = true;
      this.storesService.updateStore(
        this.storeId,
        this.form.value.name
    );
    this.isLoading = false;
    this.dialogRef.close();
    this.form.reset();
  }

  onDelete() {
    this.isLoading = true;
    this.storesService.deleteStore(this.storeToEdit).subscribe(
      () => {
        this.isLoading = false;
        this.dialogRef.close();
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
