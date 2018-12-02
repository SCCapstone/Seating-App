import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ReservationCreateComponent } from "./reservation-create/reservation-create.component";
import { ReservationListComponent } from "./reservation-list/reservation-list.component";
import { AuthGuard } from "../../auth/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: "list", component: ReservationListComponent },
  {
    path: "create",
    component: ReservationCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit/:reservationId",
    component: ReservationCreateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule {}
