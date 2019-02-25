import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";


 const BACKEND_URL = environment.apiUrl + "/accounts/";

@Injectable({ providedIn: "root" })
export class AccountsService {
  accountToUpdate = "none";
  private accounts: Account[] = [];
  private accountsUpdated = new Subject<{
    accounts: Account[];
    accountCount: number;
  }>();
  

  constructor(private http: HttpClient, private router: Router) {}

  getAccounts(accountsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${accountsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; accounts: any; maxAccounts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(accountData => {
          return {
            accounts: accountData.accounts.map(account => {
              return {
                name: account.name,
                store: account.store,
                id: account._id,
                creator: account.creator
              };
            }),
            maxAccounts: accountData.maxAccounts
          };
        })
      )
      .subscribe(transformedAccountData => {
        this.accounts = transformedAccountData.accounts;
        this.accountsUpdated.next({
          accounts: [...this.accounts],
          accountCount: transformedAccountData.maxAccounts
        });
      });
  }

  getAccountUpdateListener() {
    return this.accountsUpdated.asObservable();
  }

  getAccount(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      store: string;
      creator: string;
    }>(BACKEND_URL + id);
  }



  updateAccount(id: string, name: string, rpDisplayName: string) {
    let accountData: Account;
    accountData = {
      id: id,
      displayName: name,
      rpDisplayName: rpDisplayName
    };
    this.http.put(BACKEND_URL + id, accountData).subscribe(response => {
      this.router.navigate(["/main/manager"]);
    });
  }

  deleteAccount(accountId: string) {
    return this.http.delete(BACKEND_URL + accountId);
  }

  setAccountToEdit(id: string) {
    this.accountToUpdate = id;
  }
  getAccountToEdit() {
    return this.accountToUpdate;
  }
}
