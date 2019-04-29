import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../../../auth/auth.service";
import { HttpClientModule } from "@angular/common/http";
import { Store } from "./store.model";
import { StoreComponent } from "./store.component";
import { MatSidenavModule, MatDialogModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material";


describe("StoreComponent", () => {
  it("should exist", () => {
    TestBed.configureTestingModule({
      declarations: [ StoreComponent ],
      imports: [ RouterTestingModule, HttpClientModule, MatSidenavModule, BrowserAnimationsModule, MatDialogModule,
         MatListModule, MatCardModule ],
      providers: []
    });
    const fixture = TestBed.createComponent(StoreComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});

