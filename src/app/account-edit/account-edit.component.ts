import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../../auth/auth.service";

export interface Time {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-account-edit",
  templateUrl: "./account-edit.component.html",
  styleUrls: ["./account-edit.component.css"]
})

export class AccountEditComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService
  ) { 
    
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      phone: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      })
      
    });
  }

}
