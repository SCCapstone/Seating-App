import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { ServersService } from "../../manager/servers/servers.service";
import { Server } from "../../manager/servers/server.model";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: 'app-side-servers',
  templateUrl: './side-servers.component.html',
  styleUrls: ['./side-servers.component.css']
})
export class SideServersComponent implements OnInit {
  editServerID = "none";
  servers: Server[] = [];
  isLoading = false;
  totalServers = 0;
  serversPerPage = 10;
  currentPage = 1;
  userIsAuthenticated = false;
  userId: string;
  private serversSub: Subscription;
  private authStatusSub: Subscription;
  constructor(
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
          this.servers = serverData.servers;
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
