import { ComponentFixture, TestBed } from '@angular/core/testing';

import { History2dSkeletonComponent } from './history2d-skeleton.component';

describe('History2dSkeletonComponent', () => {
  let component: History2dSkeletonComponent;
  let fixture: ComponentFixture<History2dSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [History2dSkeletonComponent]
    });
    fixture = TestBed.createComponent(History2dSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
