import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";


describe("AppComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ]
    });
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
