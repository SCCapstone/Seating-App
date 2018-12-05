import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ReservationsService } from "../reservations.service";
import { Reservation } from "../reservation.model";
import { AuthService } from "../../../auth/auth.service";

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
  enteredSize = "";
  enteredPhone = "";
  enteredNotes = "";
  enteredTime = "";
  enteredDate = "";
  reservation: Reservation;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private reservationId: string;
  private authStatusSub: Subscription;
  times: Time[] = [
    {value: '4:30 pm', viewValue: '4:30 pm'},
    {value: '5:00 pm', viewValue: '5:00 pm'},
    {value: '5:30 pm', viewValue: '5:30 pm'},
    {value: '6:00 pm', viewValue: '6:00 pm'},
    {value: '6:30 pm', viewValue: '6:30 pm'},
    {value: '7:00 pm', viewValue: '7:00 pm'},
    {value: '7:30 pm', viewValue: '7:30 pm'},
    {value: '8:00 pm', viewValue: '8:00 pm'}
  ]

  constructor(
    public reservationsService: ReservationsService,
    public route: ActivatedRoute,
    private authService: AuthService
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

  onSaveReservation() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.reservationsService.addReservation(
        this.form.value.name,
        this.form.value.size,
        this.form.value.phone,
        this.form.value.time,
        this.form.value.date,
        this.form.value.notes
      );
    } else {
      this.reservationsService.updateReservation(
        this.reservationId,
        this.form.value.name,
        this.form.value.size,
        this.form.value.phone,
        this.form.value.time,
        this.form.value.date,
        this.form.value.notes
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
