import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { ReservationCreateComponent } from "./reservation-create/reservation-create.component";
import { ReservationListComponent } from "./reservation-list/reservation-list.component";
import { AngularMaterialModule } from "../../angular-material.module";
import { ReservationsRoutingModule } from "./reservation-routing.module";

@NgModule({
  declarations: [ReservationCreateComponent, ReservationListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ReservationsRoutingModule
  ]
})
export class ReservationsModule {}
