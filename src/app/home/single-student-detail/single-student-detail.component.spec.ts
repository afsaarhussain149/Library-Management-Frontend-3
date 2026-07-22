import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleStudentDetailComponent } from './single-student-detail.component';

describe('SingleStudentDetailComponent', () => {
  let component: SingleStudentDetailComponent;
  let fixture: ComponentFixture<SingleStudentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleStudentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
