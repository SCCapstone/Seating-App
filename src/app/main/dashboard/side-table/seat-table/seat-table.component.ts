import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { DashboardService } from "../../dashboard.service";
import { Reservation } from "../../../reservations/reservation.model";
import { ReservationsService } from "src/app/main/reservations/reservations.service";

import { ErrorComponent } from "src/app/error/error.component";
import { Server } from "src/app/main/manager/servers/server.model";

@Component({
  selector: "app-seat-table",
  templateUrl: "./seat-table.component.html",
  styleUrls: ["./seat-table.component.css"],
  providers: [ReservationsService]
})
export class SeatTableComponent implements OnInit {
  tableName = "";
  guestsSeated = 0;
  isLoading = false;
  form: FormGroup;

  userIsAuthenticated = false;
  userId: string;

  currentDate = new Date().toLocaleDateString();

  reservation: Reservation;
  resList: Reservation[] = [];
  totalReservations = 0;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  selectedRes = "";
  selectedResID = "";
  selectedStoreID = this.dashboardService.selectedStoreID;

  private selectedTable = null;

  constructor(
    public dialogRef: MatDialogRef<SeatTableComponent>,
    public dashboardService: DashboardService,
    public reservationsService: ReservationsService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // Populate resList
    this.reservationsService.getReservations();
    this.userId = this.authService.getUserId();

    // Grabs the currently selected table.
    this.selectedTable = this.dashboardService.dashGetTable().target._objects[0];
    this.reservationsSub = this.reservationsService
      .getReservationUpdateListener()
      .subscribe(
        (reservationData: {
          reservations: Reservation[];
          reservationCount: number;
          value: "selectedResID";
          viewValue: "selectedRes";
        }) => {
          this.isLoading = false;
          this.totalReservations = reservationData.reservationCount;
          this.resList = reservationData.reservations;

          // Filters and sorts the list of reservations.
          this.resList = this.resList.filter(
            res =>
              (res.status === "New" || res.id === this.selectedTable.resId) &&
              res.store === this.selectedStoreID &&
              res.date === this.currentDate
          );
          this.resList.sort(
            (a, b) =>
              a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
          );
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    console.log("Initializing FormGroup");
    this.form = new FormGroup({
      reservation: new FormControl(null, {}),
      guestsSeated: new FormControl(null, {
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {}),
      server: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = false;
    console.log("Selected Store ID: " + this.dashboardService.selectedStoreID);

    // Sets the values in the form to those of the selected table.
    this.form.setValue({
      reservation: this.selectedTable.resId,
      guestsSeated: this.selectedTable.guestsSeated,
      notes: this.selectedTable.notes,
      server: this.selectedTable.serverId
    });

    // Checks to see if current form already has a reservation selected. If so,
    // locks the reservation field to changing reservations without clearing
    // table.

    if (this.form.getRawValue().reservation !== "") {
      this.form.controls.reservation.disable();
    }
    console.log("Reservation ID: " + this.form.getRawValue().reservation);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdateTable() {
    if (this.form.invalid) {
      return;
    }
    console.log("Updating table");
    if (this.form.value.guestsSeated < 0 || this.form.value.server === null) {
      console.log("Guests Seated or Server contains invalid value");
      this.dialog.open(ErrorComponent, {
        data: { message: "Invalid number of guests" }
      });
    } else {
      console.log("Updating res to: " + this.form.getRawValue().reservation);
      this.dashboardService.dashUpdateTable(
        this.form.value.guestsSeated,
        this.form.value.notes,
        this.form.value.server,
        this.form.getRawValue().reservation
      );

      this.dashboardService.dashRefreshTable();
      this.dialogRef.close();
    }
    // If reservation is selected, changes status to seated
    if (this.form.getRawValue().reservation !== "") {
      // Getting the whole reservation object
      let tempRes: Reservation;
      this.reservationsService
        .getReservation(this.form.getRawValue().reservation)
        .subscribe(reservationData => {
          tempRes = {
            creator: reservationData.creator,
            date: reservationData.date,
            id: reservationData._id,
            name: reservationData.name,
            notes: reservationData.notes,
            phone: reservationData.phone,
            size: reservationData.size,
            status: reservationData.status,
            store: reservationData.store,
            time: reservationData.time
          };

          this.reservationsService
            .updateReservation(
              tempRes.id,
              tempRes.name,
              tempRes.size,
              tempRes.phone,
              tempRes.time,
              tempRes.date,
              tempRes.notes,
              tempRes.store,
              "Seated"
            )
            .subscribe(() => {
              this.reservationsService.getReservations();
            });
        });
    }
  }

  loadRes(size, notes, resId) {
    console.log("loadRes called");
    this.selectedResID = resId;
    this.form.setValue({
      reservation: this.form.getRawValue().reservation,
      guestsSeated: size,
      notes: notes,
      server: this.form.value.server
    });
  }

  /**
   * Comparison for setting server value
   */
  public serverComparisonFunction = function(option, value): boolean {
    return option.id === value.id;
  };
}
