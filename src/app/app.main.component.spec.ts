import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";
import { HttpClientModule } from "@angular/common/http";

import { MainComponent } from "./main/main.component";
import { MatSidenavModule, MatDialogModule } from "@angular/material";
import { SidenavComponent } from "./main/sidenav/sidenav.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";



describe("MainComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent, AppComponent, SidenavComponent ],
      imports: [ RouterTestingModule, HttpClientModule, MatSidenavModule, BrowserAnimationsModule, MatDialogModule ],
      providers: []
    });
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});

