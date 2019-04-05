import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { DashboardService } from "./dashboard.service";
import { ServersService } from "../manager/servers/servers.service";
import { AuthService } from "src/app/auth/auth.service";
import { WelcomeComponent } from "../welcome/welcome.component";
import { WelcomeService } from "../welcome/welcome.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

  isLoading = false;

  totalServers = 0;

  private serversSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public dialog: MatDialog,
    public dashboardService: DashboardService,
    public welcomeService: WelcomeService,
    public serversService: ServersService,
    private authService: AuthService
  ) {}


  ngOnInit() {
    this.isLoading = true;
    this.serversService.getServers();
    this.dashboardService.userId = this.authService.getUserId();

    this.dashboardService.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.dashboardService.userIsAuthenticated = isAuthenticated;
        this.dashboardService.userId = this.authService.getUserId();
      });
      setTimeout(() => {
        if (this.welcomeService.getJustLogin() === true) {
          this.openWelcome();
        } else {
          this.welcomeService.loadDashboard();
        }
      });
  }
  openWelcome(): void {
    const dialogRef = this.dialog.open(WelcomeComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}
