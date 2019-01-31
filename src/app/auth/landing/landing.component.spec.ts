import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LandingComponent } from "./landing.component";

describe("LandingComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponent ]
    });
    const fixture = TestBed.createComponent(LandingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
