import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-side-table',
  templateUrl: './side-table.component.html',
  styleUrls: ['./side-table.component.css']
})
export class SideTableComponent implements OnInit {

  changedTable = null;
  tableName = "";

  constructor(
    public dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardService.tableChange.subscribe(changedTable => {
      this.changedTable = changedTable;
      this.getTableData(this.changedTable);
     });
  }
  getTableData(table) {
    this.tableName = table.target._objects[0].name;
    console.log("Final step - table data should be here: ", table);
  }
}


