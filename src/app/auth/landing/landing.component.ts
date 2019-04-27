import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {

  constructor(
    private AuthService: AuthService
  ) {}

  ngOnInit() {
    this.AuthService.logout();
  }
}
