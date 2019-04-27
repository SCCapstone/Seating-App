import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../../environments/environment";
import { Server } from "./server.model";
import { forEach } from "@angular/router/src/utils/collection";

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

  /**
   * Gets a list of all servers from the backend.
   */
  getServers() {
    this.http
      .get<{ message: string; servers: any; maxServers: number }>(BACKEND_URL)
      .pipe(
        map(serverData => {
          return {
            servers: serverData.servers.map(server => {
              return {
                name: server.name,
                color: server.color,
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

  /**
   * Gets information for a specified server from the database.
   * @param id The server to get
   */
  getServer(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      color: string;
      store: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  /**
   * Adds a server to the database.
   * @param name The name of the server to be added.
   * @param color The color of the server to be added.
   * @param store The store of the server to be added.
   */
  addServer(name: string, color: string, store: string) {
    const serverData: Server = {
      id: null,
      name: name,
      color: color,
      store: store,
      creator: null
    };
    return this.http.post<{ message: string; store: Server }>(
      BACKEND_URL,
      serverData
    );
  }

  /**
   * Updates a server on the database.
   * @param id The id of the server to be updated. Used to pick which server is updated.
   * @param name The new name of the server to be updated.
   * @param color The new color of the server to be updated.
   * @param store The new store of the server to be updated.
   */
  updateServer(id: string, name: string, color: string, store: string) {
    let serverData: Server;
    serverData = {
      id: id,
      name: name,
      color: color,
      store: store,
      creator: null
    };
    return this.http.put(BACKEND_URL + id, serverData);
  }

  /**
   * Deleted a server from the database.
   * @param serverId The server ID to be deleted
   */
  deleteServer(serverId: string) {
    return this.http.delete(BACKEND_URL + serverId);
  }

  /**
   * Getter and setter for choosing which server is being updated. Used in
   * edit modal.
   * @param id the server id that is being updated.
   */
  setServerToEdit(id: string) {
    this.serverToUpdate = id;
  }
  getServerToEdit() {
    return this.serverToUpdate;
  }

  /**
   * Deletes all servers that belong to a certain store.
   * Used for when deleting a store.
   * @param storeId The store ID which has been deleted.
   */
  deleteStoreServers(storeId: string) {
    console.log("Deleting Servers...");
    this.servers.forEach(server => {
      if (server.store === storeId) {
        console.log("Deleted: " + server.name);
        this.deleteServer(server.id).subscribe(() => {
          this.getServers();
        });
      }
    });
  }
}
