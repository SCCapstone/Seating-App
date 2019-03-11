import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Floorplan } from 'src/app/main/manager/fp-builder/floorplan.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FloorplansService } from 'src/app/main/manager/fp-builder/floorplan.service';
import { StoresService } from 'src/app/main/manager/store/stores.service';
import { DashboardService } from '../../dashboard.service';
import { Server } from "../../../manager/servers/server.model";

@Component({
  selector: 'app-seat-table',
  templateUrl: './seat-table.component.html',
  styleUrls: ['./seat-table.component.css']
})
export class SeatTableComponent implements OnInit {
  tableName = "";
  guestsSeated = 0;
  isLoading = false;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SeatTableComponent>,
    public dashboardService: DashboardService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    console.log("Initializing FormGroup");
    this.form = new FormGroup({
      guestsSeated: new FormControl(null, {
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {
      }),
      server: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = false;


  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onUpdateTable() {
    console.log("Updating table");
    this.dashboardService.dashUpdateTable(this.form.value.guestsSeated, this.form.value.notes, this.form.value.server);
    this.dashboardService.dashRefreshTable();
    this.dialogRef.close();
  }
}
