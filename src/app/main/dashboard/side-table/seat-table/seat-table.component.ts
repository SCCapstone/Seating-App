import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Floorplan } from 'src/app/main/manager/fp-builder/floorplan.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FloorplansService } from 'src/app/main/manager/fp-builder/floorplan.service';
import { StoresService } from 'src/app/main/manager/store/stores.service';
import { DashboardService } from '../../dashboard.service';
import { Server } from "../../../manager/servers/server.model";
import { Reservation } from "../../../reservations/reservation.model";
import { ReservationsService } from "src/app/main/reservations/reservations.service";

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
  reservationsPerPage = 50;
  currentPage = 1;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  selectedRes = "";
  selectedResID = "";

  constructor(
    public dialogRef: MatDialogRef<SeatTableComponent>,
    public dashboardService: DashboardService,
    public reservationsService: ReservationsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    // Populate resList
    this.reservationsService.getReservations(
      this.reservationsPerPage,
      this.currentPage
    );
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
      }),
      reservations: new FormControl(null, {
       // validators: [Validators.required]
      })
    });
    this.isLoading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onUpdateTable() {
    console.log("Updating table");
    this.dashboardService.dashUpdateTable(
    this.form.value.reservation,
    this.form.value.guestsSeated,
    this.form.value.notes,
    this.form.value.server);

    this.dashboardService.dashRefreshTable();
    this.dialogRef.close();
  }
}
