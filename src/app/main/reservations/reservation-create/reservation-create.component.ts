import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { Store } from "../../manager/store/store.model";
import { StoresService } from "../../manager/store/stores.service";
import { ReservationsService } from "../reservations.service";
import { Reservation } from "../reservation.model";
import { AuthService } from "../../../auth/auth.service";
import { DashboardService } from "../../dashboard/dashboard.service";
import { WelcomeService } from "../../welcome/welcome.service";
import { ErrorComponent } from "src/app/error/error.component";
import { MatDialog } from "@angular/material";

export interface Time {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-reservation-create",
  templateUrl: "./reservation-create.component.html",
  styleUrls: ["./reservation-create.component.css"]
})

export class ReservationCreateComponent implements OnInit, OnDestroy {
  enteredName = "";
  enteredSize = 0;
  enteredPhone = "";
  enteredNotes = "";
  enteredTime = "";
  enteredDate = "";
  reservation: Reservation;
  isLoading = false;
  form: FormGroup;

  userIsAuthenticated = false;
  userId: string;

  private mode = "create";
  private reservationId: string;
  private storesSub: Subscription;
  private authStatusSub: Subscription;

  store: Store;
  storeList: Store[] = [];
  defaultFloorplan: string;
  selectedStore = "";
  selectedStoreID: string;
  totalStores = 0;
  selectedStoreName = "Select a Store";

  times: Time[] = [
    { value: "4:30 pm", viewValue: "4:30 pm" },
    { value: "5:00 pm", viewValue: "5:00 pm" },
    { value: "5:30 pm", viewValue: "5:30 pm" },
    { value: "6:00 pm", viewValue: "6:00 pm" },
    { value: "6:30 pm", viewValue: "6:30 pm" },
    { value: "7:00 pm", viewValue: "7:00 pm" },
    { value: "7:30 pm", viewValue: "7:30 pm" },
    { value: "8:00 pm", viewValue: "8:00 pm" }
  ];

  constructor(
    public dashboardService: DashboardService,
    public reservationsService: ReservationsService,
    public storesService: StoresService,
    public welcomeService: WelcomeService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  // Form control when initialized; validation length and authentication.
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    // Populate storeList
    this.storesService.getStores();
    this.storesSub = this.storesService.getStoreUpdateListener().subscribe(
      (storeData: {
        stores: Store[];
        storeCount: number;
        value: "selectedStoreID";
        viewValue: "selectedStore";
      }) => {
        this.isLoading = false;
        this.totalStores = storeData.storeCount;
        this.storeList = storeData.stores;
      }
    );

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      size: new FormControl(null, {
        validators: [Validators.required]
      }),
      phone: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      time: new FormControl(null, {
        validators: [Validators.required]
      }),
      date: new FormControl(null, {
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {
      }),
      store: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("reservationId")) {
        console.log("Edit mode entered");
        this.mode = "edit";
        this.reservationId = paramMap.get("reservationId");
        this.isLoading = true;
        this.reservationsService.getReservation(this.reservationId).subscribe(reservationData => {
            this.isLoading = false;
            this.reservation = {
              id: reservationData._id,
              name: reservationData.name,
              size: reservationData.size,
              phone: reservationData.phone,
              time: reservationData.time,
              date: reservationData.date,
              notes: reservationData.notes,
              creator: reservationData.creator,
              store: reservationData.store,
              status: reservationData.status
            };
            this.form.setValue({
              name: this.reservation.name,
              size: this.reservation.size,
              phone: this.reservation.phone,
              time: this.reservation.time,
              date: this.reservation.date,
              notes: this.reservation.notes,
              store: this.reservation.store
            });
          });
      } else {
        console.log("Create mode entered");
        this.mode = "create";
        this.reservationId = null;
      }
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
        this.form.setValue({
          name: this.form.value.name,
          size: this.form.value.notes,
          phone: this.form.value.phone,
          time: this.form.value.time,
          date: this.form.value.date,
          notes: this.form.value.notes,
          store: this.selectedStoreID
        });
      }
    });

  }

  onSaveReservation() {
    if (this.form.invalid) {
      console.log("Cannot Save. Invalid field");
      return;
    }
    if (this.form.value.size < 0 || this.form.value.phone.length < 10 ) {
      console.log("Invalid number of guests or Invalid Phone");
      this.dialog.open(ErrorComponent, { data: { message: "Invalid number of guests or phone" } });
    } else {
    this.isLoading = true;
    if (this.mode === "create") {
      this.reservationsService.addReservation(
        this.form.value.name,
        this.form.value.size,
        this.form.value.phone,
        this.form.value.time,
        this.form.value.date.toLocaleDateString(),
        this.form.value.notes,
        this.form.value.store
      );
    } else {
      console.log("Updating reservation. New store name: " + this.form.value.store);
      this.reservationsService.updateReservation(
        this.reservationId,
        this.form.value.name,
        this.form.value.size,
        this.form.value.phone,
        this.form.value.time,
        this.form.value.date.toLocaleDateString(),
        this.form.value.notes,
        this.form.value.store,
        "New"
      ).subscribe(() => {
        this.reservationsService.getReservations();
        this.isLoading = false;
        this.router.navigate(["/main/reservations"]);
      });
    }

    this.form.reset();
  }
  }

  setReservationStore(name: string, storeID: string) {
    this.selectedStore = name;
    this.selectedStoreID = storeID;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
