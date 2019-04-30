import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";
import { tokenKey } from "@angular/core/src/view";
import { AuthData } from "src/app/auth/auth-data.model";
import { SuccessComponent } from "../../success/success.component";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit, OnDestroy {

  account = {
    userId: "",
    email: ""
  };
  editAccountID = "none";
  accounts: AuthData[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.authService.getAccounts(); //gets the account to use on the page
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAccountUpdateListener()
      .subscribe((accountData: { accounts: AuthData[] }) => {
        this.isLoading = false;
        this.accounts = accountData.accounts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth(); //verifies if user is authenticated
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => { //subscribes if the token for authentication changes when email changes
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.authService.getUserEmail(this.userId)
      .subscribe(
        (userData => {
          this.account.email = userData.email;
          this.account.userId = userData.userId;
        })
      );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


  openEditAccount(email: string): void {
    this.authService.setAccountToEdit(email);
    const dialogRef = this.dialog.open(AccountEditComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-account-edit',
  templateUrl: 'account-edit.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountEditComponent implements OnInit, OnDestroy {
  accountToEdit = "none";
  enteredEmail = "";
  account: AuthData;
  isLoading = false;
  form: FormGroup;
  private mode = "edit";
  private usersId: string;
  private authStatusSub: Subscription;

  email = null;
  password = null;

  userIsAuthenticated = false;
  userId: string;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AccountEditComponent>,
    public accountsService: AuthService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.accountToEdit = this.authService.getAccountToEdit();
    console.log("Editing: " + this.accountToEdit);
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAccountUpdateListener()
      .subscribe((accountData: { accounts: AuthData[] }) => { //subscribes to the changes in auth data's email
        this.isLoading = false;
        this.email = accountData.accounts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth(); //ensure the correct user is logged in
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.isLoading = true;
    this.authService.getUserEmail(this.userId).subscribe(accountData => { //subscribes to changes in user email
      this.isLoading = false;
      this.form.setValue({ //sets default value to the user's current email
        email: accountData.email
      });
    });
  }

  onUpdateAccount() {
    if (this.form.invalid) {
      return;
    }
    this.userId = this.accountToEdit;
    this.isLoading = true;
    var thisPromise = this; //promises cant read ".this" for some reason so I have to set it as thisPromise to use
    this.authService.updateAccount(
      this.form.value.email).then(() => {
        console.log("log success")
        console.log("Updated account " + this.form.value.email);
        this.isLoading = false;
        this.dialogRef.close();
        this.form.reset();
        thisPromise.account = this.form.value.email;
        window.location.reload(); //reloads page after changing email
        this.dialog.open(SuccessComponent, { data: { message: "Email has been successfully updated!" } });

      });
  }

  onDelete() {
    this.isLoading = true;
    this.authService.deleteAccount(this.accountToEdit).subscribe(() => {
      //this.authService.getAccounts(); //maybe
      this.isLoading = false;
      this.dialogRef.close();
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
