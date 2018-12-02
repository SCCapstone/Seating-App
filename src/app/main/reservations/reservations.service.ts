import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";
import { Reservation } from "./reservation.model";

const BACKEND_URL = environment.apiUrl + "/reservations/";

@Injectable({ providedIn: "root" })
export class ReservationsService {
  private reservations: Reservation[] = [];
  private reservationsUpdated = new Subject<{
    reservations: Reservation[];
    reservationCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getReservations(reservationsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${reservationsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; reservations: any; maxReservations: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(reservationData => {
          return {
            reservations: reservationData.reservations.map(reservation => {
              return {
                name: reservation.name,
                size: reservation.size,
                phone: reservation.phone,
                notes: reservation.notes,
                id: reservation._id,
                creator: reservation.creator
              };
            }),
            maxReservations: reservationData.maxReservations
          };
        })
      )
      .subscribe(transformedReservationData => {
        this.reservations = transformedReservationData.reservations;
        this.reservationsUpdated.next({
          reservations: [...this.reservations],
          reservationCount: transformedReservationData.maxReservations
        });
      });
  }

  getReservationUpdateListener() {
    return this.reservationsUpdated.asObservable();
  }

  getReservation(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      size: string;
      phone: string;
      notes: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addReservation(name: string, size: string, phone: string, notes: string) {
    /**const reservationData = new FormData();
    reservationData.append("name", name);
    reservationData.append("size", size);
    reservationData.append("phone", phone);
    reservationData.append("notes", notes);
    */
    const reservationData: Reservation = {
      id: null,
      name: name,
      size: size,
      phone: phone,
      notes: notes,
      creator: null
    };
    this.http
      .post<{ message: string; reservation: Reservation }>(
        BACKEND_URL,
        reservationData
      )
      .subscribe(responseData => {
        this.router.navigate(["/main/reservations"]);
      });
  }

  updateReservation(
    id: string,
    name: string,
    size: string,
    phone: string,
    notes: string
  ) {
    let reservationData: Reservation | FormData;
    if (typeof notes === "object") {
      reservationData = new FormData();
      reservationData.append("id", id);
      reservationData.append("name", name);
      reservationData.append("size", size);
      reservationData.append("phone", phone);
      reservationData.append("notes", notes);
    } else {
      reservationData = {
        id: id,
        name: name,
        size: size,
        phone: phone,
        notes: notes,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, reservationData).subscribe(response => {
      this.router.navigate(["/main/reservations"]);
    });
  }

  deleteReservation(reservationId: string) {
    return this.http.delete(BACKEND_URL + reservationId);
  }
}
