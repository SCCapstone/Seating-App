
/**
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
  constructor(public dialog: MatDialog) {}

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
  private storeId: string;
  private authStatusSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<StoreAddComponent>,
    public storeService: StoresService,
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
      if (paramMap.has("reservationId")) {
        console.log("Edit mode entered");
        this.mode = "edit";
        this.reservationId = paramMap.get("reservationId");
        this.isLoading = true;
        this.reservationsService
          .getReservation(this.reservationId)
          .subscribe(reservationData => {
            this.isLoading = false;
            this.reservation = {
              id: reservationData._id,
              name: reservationData.name,
              size: reservationData.size,
              phone: reservationData.phone,
              time: reservationData.time,
              date: reservationData.date,
              notes: reservationData.notes,
              creator: reservationData.creator
            };
            this.form.setValue({
              name: this.reservation.name,
              size: this.reservation.size,
              phone: this.reservation.phone,
              time: this.reservation.time,
              date: this.reservation.date,
              notes: this.reservation.notes
            });
          });
      } else {
        console.log("Create mode entered");
        this.mode = "create";
        this.reservationId = null;
      }
    });
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
*/
