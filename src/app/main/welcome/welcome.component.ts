import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { StoresService } from 'src/app/main/manager/store/stores.service';
import { Store } from '../manager/store/store.model';
import { WelcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  isLoading = false;
  form: FormGroup;

  userIsAuthenticated = false;
  userId: string;

  store: Store;
  storeList: Store[] = [];
  totalStores = 0;
  hasStore: boolean;

  private storesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<WelcomeComponent>,
    public welcomeService: WelcomeService,
    public storesService: StoresService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });

    this.storesService.getStores();
    this.userId = this.authService.getUserId();
    this.storesSub = this.storesService
    .getStoreUpdateListener()
    .subscribe(
      (storeData: {
        stores: Store[];
        storeCount: number;
      }) => {
        this.isLoading = false;
        this.totalStores = storeData.storeCount;
        this.storeList = storeData.stores;
        this.hasStore = this.userHasStore();
      }
    );
    this.form = new FormGroup({
      defaultStore: new FormControl(null, {
        validators: [Validators.required]
      })
    });


  }

  /**
   * Returns the number of stores from backend that are owned by a specific user.
   * @param userId the id of the user that stores are being counted for
   */
  userHasStore() {
    for (let i = 0; i < this.storeList.length; ++i) {
      if (this.storeList[i].creator === this.userId) {
        return true;
      }
    }
    return false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadDefaultStore(storeName: string, storeID: string, floorplanID: string) {
    this.welcomeService.loadDefaultStore(storeName, storeID, floorplanID);
    
  }
}
