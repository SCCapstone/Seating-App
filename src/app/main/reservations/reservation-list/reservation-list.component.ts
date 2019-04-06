import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Reservation } from "../reservation.model";
import { ReservationsService } from "../reservations.service";
import { AuthService } from "../../../auth/auth.service";

import { StoresService } from "../../manager/store/stores.service";
import { Store } from "../../manager/store/store.model";
import { WelcomeService } from "../../welcome/welcome.service";

@Component({
  selector: "app-reservation-list",
  templateUrl: "./reservation-list.component.html",
  styleUrls: ["./reservation-list.component.css"]
})
export class ReservationListComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  isLoading = false;
  totalReservations = 0;
  reservationsPerPage = 50;
  currentPage = 1;
  pageSizeOptions = [10, 25, 50, 100];
  userIsAuthenticated = false;
  userId: string;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  selectedStoreID: string;
  selectedStoreName = "Select a Store";
  storeList: Store[] = [];
  private storesSub: Subscription;

  constructor(
    public reservationsService: ReservationsService,
    public welcomeService: WelcomeService,
    public authService: AuthService,
    private storesService: StoresService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.reservationsService.getReservations(
      this.reservationsPerPage,
      this.currentPage
    );
    this.storesService.getStores();
    this.userId = this.authService.getUserId();
    console.log("User Id: " + this.userId);
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
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe((storeData: { stores: Store[]; storeCount: number}) => {
        this.isLoading = false;
        this.storeList = storeData.stores;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    if (this.welcomeService.selectedStoreID != null) {
      this.selectedStoreID = this.welcomeService.selectedStoreID;
      this.selectedStoreName = this.welcomeService.selectedStoreName;
    }
  }

   /**
   * This function sets the selected store class variable
   * @param store store to be selected
   */
  selectStore(storeID: string, storeName: string) {

    this.selectedStoreID = storeID;
    this.selectedStoreName = storeName;
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
