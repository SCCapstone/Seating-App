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

@Component({
  selector: 'app-seat-table',
  templateUrl: './seat-table.component.html',
  styleUrls: ['./seat-table.component.css']
})
export class SeatTableComponent implements OnInit {
  tableName = "";
  numSeated = 0;
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
      numSeated: new FormControl(null, {
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
    this.dashboardService.selectedTable.target._objects[0].guestsSeated = this.form.value.numSeated;
    this.dashboardService.dashSetTable();
    this.dialogRef.close();
  }
}
