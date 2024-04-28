import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Result3dSkeletonComponent } from './result3d-skeleton.component';

describe('Result3dSkeletonComponent', () => {
  let component: Result3dSkeletonComponent;
  let fixture: ComponentFixture<Result3dSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Result3dSkeletonComponent]
    });
    fixture = TestBed.createComponent(Result3dSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
