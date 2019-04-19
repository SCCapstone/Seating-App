import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DashboardService } from '../../dashboard.service';
import { Reservation } from "../../../reservations/reservation.model";
import { ReservationsService } from "src/app/main/reservations/reservations.service";

import { ErrorComponent } from 'src/app/error/error.component';
import { Server } from "src/app/main/manager/servers/server.model";


@Component({
  selector: 'app-seat-table',
  templateUrl: './seat-table.component.html',
  styleUrls: ['./seat-table.component.css'],
  providers: [ReservationsService]
})
export class SeatTableComponent implements OnInit {
  tableName = "";
  guestsSeated = 0;
  isLoading = false;
  form: FormGroup;

  userIsAuthenticated = false;
  userId: string;

  reservation: Reservation;
  resList: Reservation[] = [];
  totalReservations = 0;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  selectedRes = "";
  selectedResID = "";
  selectedStoreID = this.dashboardService.selectedStoreID;

  constructor(
    public dialogRef: MatDialogRef<SeatTableComponent>,
    public dashboardService: DashboardService,
    public reservationsService: ReservationsService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    // Populate resList
    this.reservationsService.getReservations();
    this.userId = this.authService.getUserId();
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
      guestsSeated: new FormControl(null, {
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {
      }),
      server: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = false;
    console.log("Selected Store ID: " + this.dashboardService.selectedStoreID);

    // Autofilling the server drop down on table selection
    // Currently only works after table has been set after a refresh
    // NOT FINISHED YET

    let tempServer: Server = null;
    tempServer = this.dashboardService.dashGetTable().target._objects[0].serverId;
    console.log(tempServer);
      this.form.setValue({
        guestsSeated: this.form.value.guestsSeated,
        notes: this.form.value.notes,
        server: tempServer
      });
      console.log(this.guestsSeated);

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
      this.dialog.open(ErrorComponent, { data: { message: "Invalid number of guests" } });

    } else {
    this.dashboardService.dashUpdateTable(
    this.form.value.guestsSeated,
    this.form.value.notes,
    this.form.value.server,
    this.selectedResID);

    this.dashboardService.dashRefreshTable();
    this.dialogRef.close();
    }
    // If reservation is selected, changes status to seated
    if (this.selectedResID !== "") {

      // Getting the whole reservation object
      let tempRes: Reservation;
      this.reservationsService.getReservation(this.selectedResID)
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

          this.reservationsService.updateReservation(
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
   console.log("implementRes called");
   this.selectedResID = resId;
   this.form.setValue({guestsSeated: size, notes: notes, server: this.form.value.server});
  }

  /**
   * Comparison for setting server value
   */
  public serverComparisonFunction = function( option, value): boolean {
    return option.id === value.id;
  };
}
