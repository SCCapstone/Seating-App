import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideServersComponent } from './side-servers.component';

describe('SideServersComponent', () => {
  let component: SideServersComponent;
  let fixture: ComponentFixture<SideServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
