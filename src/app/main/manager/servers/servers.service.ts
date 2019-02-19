import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../../environments/environment";
import { Server } from "./server.model";

const BACKEND_URL = environment.apiUrl + "/servers/";

@Injectable({ providedIn: "root" })
export class ServersService {
  serverToUpdate = "none";
  private servers: Server[] = [];
  private serversUpdated = new Subject<{
    servers: Server[];
    serverCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getServers(serversPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${serversPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; servers: any; maxServers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(serverData => {
          return {
            servers: serverData.servers.map(server => {
              return {
                name: server.name,
                store: server.store,
                id: server._id,
                creator: server.creator
              };
            }),
            maxServers: serverData.maxServers
          };
        })
      )
      .subscribe(transformedServerData => {
        this.servers = transformedServerData.servers;
        this.serversUpdated.next({
          servers: [...this.servers],
          serverCount: transformedServerData.maxServers
        });
      });
  }

  getServerUpdateListener() {
    return this.serversUpdated.asObservable();
  }

  getServer(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      store: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addServer(name: string, store: string) {
    const serverData: Server = {
      id: null,
      name: name,
      store: store,
      creator: null
    };
    this.http
      .post<{ message: string; store: Server }>(BACKEND_URL, serverData)
      .subscribe(responseData => {
        this.router.navigate(["/main/manager"]);
      });
  }

  updateServer(id: string, name: string, store: string) {
    let serverData: Server;
    serverData = {
      id: id,
      name: name,
      store: store,
      creator: null
    };
    this.http.put(BACKEND_URL + id, serverData).subscribe(response => {
      this.router.navigate(["/main/manager"]);
    });
  }

  deleteServer(serverId: string) {
    return this.http.delete(BACKEND_URL + serverId);
  }

  setServerToEdit(id: string) {
    this.serverToUpdate = id;
  }
  getServerToEdit() {
    return this.serverToUpdate;
  }
}
