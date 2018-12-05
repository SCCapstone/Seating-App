import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideResosComponent } from './side-resos.component';

describe('SideResosComponent', () => {
  let component: SideResosComponent;
  let fixture: ComponentFixture<SideResosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideResosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideResosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
