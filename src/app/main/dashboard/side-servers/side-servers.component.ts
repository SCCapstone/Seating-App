import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { ServersService } from "../../manager/servers/servers.service";
import { Server } from "../../manager/servers/server.model";
import { AuthService } from "../../../auth/auth.service";

import { DashboardService } from "../../dashboard/dashboard.service";

@Component({
  selector: 'app-side-servers',
  templateUrl: './side-servers.component.html',
  styleUrls: ['./side-servers.component.css']
})
export class SideServersComponent implements OnInit {
  editServerID = "none";
  // servers: Server[] = [];
  isLoading = false;

  // This should be changed, seeing as we have not implemented pagenation
  // for servers yet.
  totalServers = 0;
  serversPerPage = 50;
  currentPage = 1;

  userIsAuthenticated = false;
  userId: string;
  private serversSub: Subscription;
  private authStatusSub: Subscription;
  constructor(
    public dashboardService: DashboardService,
    public serversService: ServersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.serversService.getServers(
      this.serversPerPage,
      this.currentPage
    );
    this.userId = this.authService.getUserId();
    this.serversSub = this.serversService
      .getServerUpdateListener()
      .subscribe(
        (serverData: {
          servers: Server[];
        }) => {
          this.isLoading = false;
          this.dashboardService.servers = serverData.servers;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }


}
