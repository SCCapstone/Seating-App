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
  userIsAuthenticated = false;
  userId: string;
  private reservationsSub: Subscription;
  private authStatusSub: Subscription;

  selectedStoreID: string;
  selectedStoreName = "Select a Store";
  storeList: Store[] = [];
  private storesSub: Subscription;

  selectedDate: Date = new Date();

  constructor(
    public reservationsService: ReservationsService,
    public welcomeService: WelcomeService,
    public authService: AuthService,
    private storesService: StoresService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.reservationsService.getReservations();
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
          this.reservations.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
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

  /**
   * Changes the selected date for filtering.
   * @param event The event that contains the new selected date.
   */
  filterDate(event: any): void {
    console.log(event.target.value);
    this.selectedDate = event.target.value;
  }

  /**
   * Converts the provided time value into a 12h format with AM or PM.
   * @param time The time value to be converted
   */
  convertTimeTo12Hour(time: string) {
    let time12Hour = "";

    if (+time.substring(0, 2) > 12 ) {
      time12Hour = ((+time.substring(0, 2) - 12) + time.substring(2, 5) + " PM");
    } else {
      time12Hour = time + " AM";
    }
    return time12Hour;
  }
}
