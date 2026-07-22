import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatBookingWizardComponent } from './seat-booking-wizard.component';

describe('SeatBookingWizardComponent', () => {
  let component: SeatBookingWizardComponent;
  let fixture: ComponentFixture<SeatBookingWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatBookingWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatBookingWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
