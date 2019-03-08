import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  accountToUpdate = "none";
  private accounts: Account[] = [];
  private accountsUpdated = new Subject<{
    accounts: Account[];
    accountCount: number;
  }>(); 

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {
        this.router.navigate(["/"]);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/main/dashboard"]);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  public getAccountUpdateListener() {
    return this.accountsUpdated.asObservable();
  }

  public getAccounts(email: string, id: string) {
  //  const queryParams = `?pagesize=${accountsPerPage}&page=${currentPage}`;
    const queryParams = `?null=${email}`;
    this.http
      .get<{ message: string; accounts: any; maxAccounts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(accountData => {
          return {
            accounts: accountData.accounts.map(account => {
              return {
                email: account.email,
                //store: account.store,
                id: this.userId
                //creator: account.creator
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

  public getAccount(email: string) {
    return this.http.get<{
      _id: string;
      email: string;
    }>(BACKEND_URL + email);
  }

  //WILL NEED TO FIX AFTER BETA:

 /* public updateAccount(email: string, id: string) {
    let accountData: Account;
    accountData = {
      email: email,
      id: id
    };
    this.http.put(BACKEND_URL + id, accountData).subscribe(response => {
      this.router.navigate(["/main/account"]);
    });
  }
  */

  public deleteAccount(accountId: string) {
    return this.http.delete(BACKEND_URL + accountId);
  }

  public setAccountToEdit(id: string) {
    this.accountToUpdate = id;
  }
  public getAccountToEdit() {
    return this.accountToUpdate;
  }
}
