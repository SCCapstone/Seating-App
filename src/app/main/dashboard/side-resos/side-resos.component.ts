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

          this.reservations.sort(
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

  /**
   * Converts the provided time value into a 12h format with AM or PM.
   * @param time The time value to be converted
   */
  convertTimeTo12Hour(time: string) {
    let time12Hour = "";

    if (+time.substring(0, 2) > 12) {
      time12Hour = +time.substring(0, 2) - 12 + time.substring(2, 5) + " PM";
    } else {
      time12Hour = time + " AM";
    }
    return time12Hour;
  }

  ngOnDestroy() {
    this.reservationsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
