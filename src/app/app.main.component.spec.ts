import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";
import { HttpClientModule } from "@angular/common/http";

import { MainComponent } from "./main/main.component";

// import { StoresService } from "./stores.service";
// import { Store } from "./store.model";


describe("MainComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent ], imports: [ RouterTestingModule, HttpClientModule ]
    });
    const fixture = TestBed.createComponent(MainComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  })
})
