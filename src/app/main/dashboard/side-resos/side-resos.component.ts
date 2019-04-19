import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Reservation } from "../../reservations/reservation.model";
import { ReservationsService } from "../../reservations/reservations.service";
import { AuthService } from "../../../auth/auth.service";
import { WelcomeService } from "../../welcome/welcome.service";

@Component({
  selector: "app-side-resos",
  templateUrl: "./side-resos.component.html",
  styleUrls: ["./side-resos.component.css"]
})
export class SideResosComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  isLoading = false;
  totalReservations = 0;
  userIsAuthenticated = false;
  userId: string;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  currentDate = new Date().toLocaleDateString();

  constructor(
    public reservationsService: ReservationsService,
    public welcomeService: WelcomeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.reservationsService.getReservations();
    this.userId = this.authService.getUserId();
    this.reservationsSub = this.reservationsService
      .getReservationUpdateListener()
      .subscribe(
        (reservationData: {
          reservations: Reservation[];
          reservationCount: number;
        }) => {
          this.isLoading = false;
          this.totalReservations = reservationData.reservationCount;
          this.reservations = reservationData.reservations;
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

  onDelete(reservationId: string) {
    this.isLoading = true;
    this.reservationsService.deleteReservation(reservationId).subscribe(
      () => {
        this.reservationsService.getReservations();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.reservationsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

