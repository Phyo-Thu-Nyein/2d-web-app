import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenenceComponent } from './maintenence.component';

describe('MaintenenceComponent', () => {
  let component: MaintenenceComponent;
  let fixture: ComponentFixture<MaintenenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenenceComponent]
    });
    fixture = TestBed.createComponent(MaintenenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
