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
  changedTable = null;
  tableName = "";
  numSeated = 0;
  isSeated = false;
  isLoading = false;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SeatTableComponent>,
    public dashboardService: DashboardService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.isLoading = true;
    this.dashboardService.tableChange.subscribe(changedTable => {
      console.log("HEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
      this.changedTable = changedTable;
      this.getTableData(this.changedTable);
      console.log("ISSS THIISSS EVEEEN WORKING???");
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onUpdateTable() {

  }
  setDefaultSeating(isSat: boolean, capacity: number) {
    this.numSeated = capacity;
    this.isSeated = isSat;
  }
  getTableData(table) {
    this.tableName = table.target._objects[0].name;
    console.log("Check for that table data");
  }

}
