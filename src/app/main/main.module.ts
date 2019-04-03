import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { MainRoutingModule } from "./main-routing.module";
import { AccountComponent, AccountEditComponent } from "./account/account.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagerComponent } from "./manager/manager.component";
import { ReservationsComponent } from "./reservations/reservations.component";
import { CanvasComponent } from "./dashboard/canvas/canvas.component";
import { SideResosComponent } from "./dashboard/side-resos/side-resos.component";
import { SideServersComponent } from "./dashboard/side-servers/side-servers.component";
import { StoreComponent, StoreAddComponent, StoreEditComponent } from './manager/store/store.component';
import { FpBuilderCreateComponent } from './manager/fp-builder/fp-builder-create/fp-builder-create.component';
import { FpBuilderEditComponent } from "./manager/fp-builder/fp-builder-edit/fp-builder-edit.component";
import { ServersComponent, ServersAddComponent, ServersEditComponent } from './manager/servers/servers.component';
import { SideTableComponent } from './dashboard/side-table/side-table.component';
import { SideStoreComponent } from './dashboard/side-store/side-store.component';
import { SeatTableComponent } from "./dashboard/side-table/seat-table/seat-table.component";
import { FloorplansComponent } from './manager/floorplans/floorplans.component';

@NgModule({
  declarations: [
    AccountComponent,
    AccountEditComponent,
    DashboardComponent,
    ManagerComponent,
    ReservationsComponent,
    CanvasComponent,
    SideResosComponent,
    SideServersComponent,
    StoreComponent,
    StoreEditComponent,
    StoreAddComponent,
    FpBuilderCreateComponent,
    FpBuilderEditComponent,
    ServersComponent,
    ServersAddComponent,
    ServersEditComponent,
    SideTableComponent,
    SideStoreComponent,
    SeatTableComponent,
    FloorplansComponent
  ],
  imports: [CommonModule, AngularMaterialModule, FormsModule, MainRoutingModule, ReactiveFormsModule],
  entryComponents: [
    AccountEditComponent,
    AccountComponent,
    ServersComponent,
    ServersAddComponent,
    ServersEditComponent,
    StoreComponent,
    StoreAddComponent,
    StoreEditComponent,
    SeatTableComponent,
    FloorplansComponent,
    FpBuilderCreateComponent,
    FpBuilderEditComponent
  ],
  bootstrap: [ServersComponent, StoreComponent, FloorplansComponent]
})
export class MainModule {}
