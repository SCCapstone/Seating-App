import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideStoreComponent } from './side-store.component';

describe('SideStoreComponent', () => {
  let component: SideStoreComponent;
  let fixture: ComponentFixture<SideStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
