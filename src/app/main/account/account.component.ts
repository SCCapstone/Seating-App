import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { AccountsService } from "./accounts.service";


@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {

  isLoading = false;
  currentPage = 1;
  accountsPerPage = 10;
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  constructor(
    public dialog: MatDialog,
    public accountsService: AccountsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.accountsService.getAccounts(
      this.accountsPerPage,
      this.currentPage
    );
    this.currentPage;
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
    this.accountsService.setAccountToEdit(id);
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
  enteredName = "";
  isLoading = false;
  form: FormGroup;
  private mode = "edit";
  private accountId: string;
  private authStatusSub: Subscription;
  private rpDisplayName: string;

  currentPage = 1;

  userIsAuthenticated = false;
  userId: string;

  constructor(
    public dialogRef: MatDialogRef<AccountEditComponent>,
    public accountsService: AccountsService,
    public accountservice: AccountsService,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    /*
    this.serverToEdit = this.serversService.getServerToEdit();
    console.log(this.serverToEdit);
    this.storesService.getStores(this.storesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.storesSub = this.storesService
      .getStoreUpdateListener()
      .subscribe(
        (storeData: {
          stores: Store[];
          storeCount: number;
        }) => {
          this.isLoading = false;
        }
      );
      */
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
  }

  onUpdateAccount() {
    if (this.form.invalid) {
      return;
    }
    this.accountId = this.accountToEdit;
    this.isLoading = true;
    this.rpDisplayName = "";
      this.accountsService.updateAccount(
        this.accountId,
        this.rpDisplayName,
        this.form.value.name
    );
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
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
