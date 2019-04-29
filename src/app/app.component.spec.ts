import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";



describe("AppComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ], imports: [ RouterTestingModule, HttpClientModule, MatDialogModule ],
      providers: []
    });
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
