import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LandingComponent } from "./landing/landing.component";
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatVideoModule } from "mat-video";

@NgModule({
  declarations: [LoginComponent, SignupComponent, LandingComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule,
    // BrowserAnimationsModule,
    MatVideoModule
  ]
})
export class AuthModule {}
