import { ComponentFixture, TestBed } from '@angular/core/testing';

import { History2dComponent } from './history2d.component';

describe('History2dComponent', () => {
  let component: History2dComponent;
  let fixture: ComponentFixture<History2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ History2dComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(History2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
