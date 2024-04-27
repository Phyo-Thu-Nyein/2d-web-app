import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Result3dComponent } from './result3d.component';

describe('Result3dComponent', () => {
  let component: Result3dComponent;
  let fixture: ComponentFixture<Result3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Result3dComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Result3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
