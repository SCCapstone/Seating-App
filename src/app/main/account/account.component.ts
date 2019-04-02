import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";
import { tokenKey } from "@angular/core/src/view";
import { AuthData } from "src/app/auth/auth-data.model";

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
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
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
  account: Account;
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
    public dialogRef: MatDialogRef<AccountEditComponent>,
    public accountsService: AuthService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.accountToEdit = this.authService.getAccountToEdit();
    console.log("Editing: " + this.accountToEdit);
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAccountUpdateListener()
      .subscribe((accountData: { accounts: AuthData[] }) => {
          this.isLoading = false;
         // this.email = accountData.accountCount;
        }); 

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.userId = this.accountToEdit;
  }

   onUpdateAccount() {
    if (this.form.invalid) {
      return;
    }
    this.userId = this.accountToEdit;
    this.isLoading = true;
       this.authService.updateAccount(
        this.email,
        this.password
    )
    this.isLoading = false;
    this.dialogRef.close();
    this.form.reset();
  }


  onDelete() {
    this.isLoading = true;
      this.accountsService.deleteAccount(this.accountToEdit).subscribe(
      () => {
        this.isLoading = false;
        this.dialogRef.close();
      }
      )
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
