import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoutineComponent } from './user-routine.component';

describe('UserRoutineComponent', () => {
  let component: UserRoutineComponent;
  let fixture: ComponentFixture<UserRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoutineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
