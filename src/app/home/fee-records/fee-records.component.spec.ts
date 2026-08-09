import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRecordsComponent } from './fee-records.component';

describe('FeeRecordsComponent', () => {
  let component: FeeRecordsComponent;
  let fixture: ComponentFixture<FeeRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeeRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
