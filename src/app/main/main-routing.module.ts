import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccountComponent } from "./account/account.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagerComponent } from "./manager/manager.component";
import { ReservationsComponent } from "./reservations/reservations.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  {
    path: "reservations",
    component: ReservationsComponent,
    loadChildren: "./reservations/reservations.module#ReservationsModule"
  },
  { path: "manager", component: ManagerComponent },
  { path: "account", component: AccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
