import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import { EmailValidator } from "@angular/forms";
import { stringify } from "@angular/core/src/render3/util";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  accountToUpdate = "none";
  private account: AuthData[] = [];
  private accounts: AuthData[] = [];
  private accountsUpdated = new Subject<{
    accounts: AuthData[];
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

  /** Eddie Added  */
  public getUserEmail(userId: string) {
    return this.http.get<{
      userId: string,
      email: string
    }>(BACKEND_URL + userId);
  }
  /** End Eddie Add */

  getAccounts() { //gets the accounts to use for changing of the email. 
    this.http.get<{ message: string; accounts: any }>(
        BACKEND_URL ).pipe(map(accountData => {
          return {
            accounts: accountData.accounts.map(account => {
              return {
                email: account.email,
                password: account.password
              };
            }),
          };
        })
        );
  }



  public getAccountUpdateListener() {
    return this.accountsUpdated.asObservable();
  }

 updateAccount(email: string) { //only update email and not password
    let accountData = {
      email: email
    }; 

    return this.http.put<{ token: string; expiresIn: number; userId: string }>(BACKEND_URL, accountData).toPromise().then(response => {
      console.log(response);
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
        this.router.navigate(["/main/account"]);
      }
    },
    error => { //not sure what to put in error block
      //this.authStatusListener.next(false);
    });

  }

  public deleteAccount(accountId: string) {
    return this.http.delete(BACKEND_URL + accountId);
  }

  public setAccountToEdit(email: string) {
    this.accountToUpdate = email;
  }
  public getAccountToEdit() {
    return this.accountToUpdate;
  }
}
