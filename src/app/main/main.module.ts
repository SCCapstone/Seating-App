import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { MainRoutingModule } from "./main-routing.module";
import { AccountComponent } from "./account/account.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagerComponent } from "./manager/manager.component";
import { ReservationsComponent } from "./reservations/reservations.component";
import { CanvasComponent } from "./dashboard/canvas/canvas.component";
import { SideResosComponent } from "./dashboard/side-resos/side-resos.component";
import { SideServersComponent } from "./dashboard/side-servers/side-servers.component";
import { StoreComponent, StoreAddComponent, StoreEditComponent } from './manager/store/store.component';
import { FpBuilderComponent } from './manager/fp-builder/fp-builder.component';
import { ServersComponent, ServersAddComponent, ServersEditComponent } from './manager/servers/servers.component';
import { SideTableComponent } from './dashboard/side-table/side-table.component';
import { SideStoreComponent } from './dashboard/side-store/side-store.component';

@NgModule({
  declarations: [
    AccountComponent,
    DashboardComponent,
    ManagerComponent,
    ReservationsComponent,
    CanvasComponent,
    SideResosComponent,
    SideServersComponent,
    StoreComponent,
    StoreEditComponent,
    StoreAddComponent,
    FpBuilderComponent,
    ServersComponent,
    ServersAddComponent,
    ServersEditComponent,
    SideTableComponent,
    SideStoreComponent
  ],
  imports: [CommonModule, AngularMaterialModule, FormsModule, MainRoutingModule, ReactiveFormsModule],
  entryComponents: [
    ServersComponent,
    ServersAddComponent,
    ServersEditComponent,
    StoreComponent,
    StoreAddComponent,
    StoreEditComponent
  ],
  bootstrap: [ServersComponent, StoreComponent]
})
export class MainModule {}
