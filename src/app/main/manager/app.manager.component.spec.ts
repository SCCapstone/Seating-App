import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { StoreComponent } from "./store/store.component";
import { MatSidenavModule, MatDialogModule, MatFormFieldModule, MatOption } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material";
import { ManagerComponent } from "./manager.component";
import { AppComponent } from "../../app.component";
import { FloorplansComponent } from "./floorplans/floorplans.component";
import { ServersComponent } from "./servers/servers.component";
import { MatRadioModule, MatSelectModule } from "@angular/material";






describe("ManagerComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({
      declarations: [ ManagerComponent, AppComponent, StoreComponent, FloorplansComponent, ServersComponent ],
      imports: [ RouterTestingModule, HttpClientModule, MatSidenavModule, BrowserAnimationsModule, MatDialogModule,
         MatListModule, MatCardModule, MatFormFieldModule, MatRadioModule, MatSelectModule ],
      providers: []
    });
    const fixture = TestBed.createComponent(ManagerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});

