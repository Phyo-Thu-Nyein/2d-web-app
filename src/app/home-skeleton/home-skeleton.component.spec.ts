import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSkeletonComponent } from './home-skeleton.component';

describe('HomeSkeletonComponent', () => {
  let component: HomeSkeletonComponent;
  let fixture: ComponentFixture<HomeSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeSkeletonComponent]
    });
    fixture = TestBed.createComponent(HomeSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
