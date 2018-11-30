import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ReservationsService } from "../reservations.service";
import { Reservation } from "../reservation.model";
import { AuthService } from "../../../auth/auth.service";

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
  reservation: Reservation;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private reservationId: string;
  private authStatusSub: Subscription;

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
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {
        validators: [Validators.required]
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
              notes: reservationData.notes,
              creator: reservationData.creator
            };
            this.form.setValue({
              name: this.reservation.name,
              size: this.reservation.size,
              phone: this.reservation.phone,
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
        this.form.value.notes
      );
    } else {
      this.reservationsService.updateReservation(
        this.reservationId,
        this.form.value.name,
        this.form.value.size,
        this.form.value.phone,
        this.form.value.notes
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
