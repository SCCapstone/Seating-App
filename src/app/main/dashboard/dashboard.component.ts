import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DashboardService } from "./dashboard.service";
import { ServersService } from "../manager/servers/servers.service";
import { AuthService } from "src/app/auth/auth.service";

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
    public dashboardService: DashboardService,
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
  }
}
