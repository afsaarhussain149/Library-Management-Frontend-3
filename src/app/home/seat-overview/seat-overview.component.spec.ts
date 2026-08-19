import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatOverviewComponent } from './seat-overview.component';

describe('SeatOverviewComponent', () => {
  let component: SeatOverviewComponent;
  let fixture: ComponentFixture<SeatOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeatOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
