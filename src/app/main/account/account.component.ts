import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

//import { AccountsService } from "./accounts.service";


@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {

  isLoading = false;
  email = null;
  phone = 0;
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  constructor(
    public dialog: MatDialog,
    //public accountsService: AccountsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
   /* this.authService.getAccounts(
      this.email,
      this.userId
    ); */
   // this.email;
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


  openEditAccount(id: string): void {
   // this.authService.setAccountToEdit(id);
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
  //enteredPhone = 0;
  enteredEmail = "";
  account: Account;
  isLoading = false;
  form: FormGroup;
  private mode = "edit";
  private authStatusSub: Subscription;
 // private rpDisplayName: string;

  email = null;
  phone = 0;

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
    console.log(this.accountToEdit);
    this.authService.getAccounts(this.email, this.userId);
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService
      .getAccountUpdateListener()
      .subscribe(
        (accountData: {
          accounts: Account[];
          accountCount: number;
        }) => {
          this.isLoading = false;
          this.email = accountData.accountCount;
        }
      );
      
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.email = this.accountToEdit;
    this.isLoading = true;

    /*
    this.authService.getAccount(this.email)
    .subscribe(accountData => {
      this.isLoading = false;
      this.account = {
        email: accountData.email,
        id: accountData._id
      };
      this.form.setValue({
        email: this.account.email
      });
    });

    */
  }
// WILL NEED TO FIX AFTER BETA:


  /* onUpdateAccount() {
    if (this.form.invalid) {
      return;
    }
    this.userId = this.accountToEdit;
    this.isLoading = true;
    //this.rpDisplayName = "";
      this.authService.updateAccount(
        this.email,
        this.userId
    ); 
    this.isLoading = false;
    this.dialogRef.close();
    this.form.reset();
  }
  */

  /*onDelete() {
    this.isLoading = true;
      this.accountsService.deleteAccount(this.accountToEdit).subscribe(
      () => {
        this.isLoading = false;
        this.dialogRef.close();
      }
      ) 
  } */

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
