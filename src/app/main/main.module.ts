import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { MainRoutingModule } from "./main-routing.module";
import { AccountComponent } from "./account/account.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagerComponent } from "./manager/manager.component";
import { ReservationsComponent } from "./reservations/reservations.component";
import { CanvasComponent } from './dashboard/canvas/canvas.component';

@NgModule({
  declarations: [
    AccountComponent,
    DashboardComponent,
    ManagerComponent,
    ReservationsComponent,
    CanvasComponent
  ],
  imports: [CommonModule, AngularMaterialModule, FormsModule, MainRoutingModule]
})
export class MainModule {}
