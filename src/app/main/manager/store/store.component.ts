

import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
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
export class StoreComponent {

  constructor(
    public dialog: MatDialog
  ) {}

  openAddStore(): void {
    const dialogRef = this.dialog.open(StoreAddComponent, {
      width: "60%"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  openEditStore(): void {
    const dialogRef = this.dialog.open(StoreEditComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}

@Component({
  selector: "app-store-add",
  templateUrl: "store-add.component.html"
})
export class StoreAddComponent implements OnInit, OnDestroy {
  enteredName = "";
  store: Store;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
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
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("storeId")) {
        console.log("Edit mode entered");
        this.mode = "edit";
        this.storeId = paramMap.get("storeId");
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
              name: this.store.name,
            });
          });
      } else {
        console.log("Create mode entered");
        this.mode = "create";
        this.storeId = null;
      }
    });
  }

  onSaveStore() {
    this.isLoading = true;
    if (this.mode === "create") {
      this.storesService.addStore(
        this.form.value.name
      );
    } else {
      this.storesService.updateStore(
        this.storeId,
        this.form.value.name
      );
    }
    console.log("Store ADDED");
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
  templateUrl: "store-edit.component.html"
})
export class StoreEditComponent {
  constructor(public dialogRef: MatDialogRef<StoreEditComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
