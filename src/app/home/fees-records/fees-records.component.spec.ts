import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesRecordsComponent } from './fees-records.component';

describe('FeesRecordsComponent', () => {
  let component: FeesRecordsComponent;
  let fixture: ComponentFixture<FeesRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeesRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
