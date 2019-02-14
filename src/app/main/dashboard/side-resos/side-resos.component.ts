import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Reservation } from "../../reservations/reservation.model";
import { ReservationsService } from "../../reservations/reservations.service";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-side-resos",
  templateUrl: "./side-resos.component.html",
  styleUrls: ["./side-resos.component.css"]
})
export class SideResosComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  isLoading = false;
  totalReservations = 0;
  reservationsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 25, 50, 100];
  userIsAuthenticated = false;
  userId: string;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public reservationsService: ReservationsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
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

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.reservationsPerPage = pageData.pageSize;
    this.reservationsService.getReservations(
      this.reservationsPerPage,
      this.currentPage
    );
  }

  onDelete(reservationId: string) {
    this.isLoading = true;
    this.reservationsService.deleteReservation(reservationId).subscribe(
      () => {
        this.reservationsService.getReservations(
          this.reservationsPerPage,
          this.currentPage
        );
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

