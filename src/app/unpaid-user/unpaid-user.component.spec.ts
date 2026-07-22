import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidUserComponent } from './unpaid-user.component';

describe('UnpaidUserComponent', () => {
  let component: UnpaidUserComponent;
  let fixture: ComponentFixture<UnpaidUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnpaidUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpaidUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
