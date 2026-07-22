import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTsComponent } from './frontpage.component';

describe('HomeTsComponent', () => {
  let component: HomeTsComponent;
  let fixture: ComponentFixture<HomeTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
