import { Component, ElementRef, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { homeService } from '../../shared/api-client/home.services';


@Component({
  selector: 'app-plans',
  standalone: false,
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
  constructor(private homeService: homeService) { }
  sessiondata: any;
  ngOnInit(): void {

    this.sessiondata = JSON.parse(sessionStorage.getItem('userdata') || '')

    this.homeService.showuserplan(this.sessiondata.userId).subscribe((data: any) => {
      console.log(data);

    })
  }
  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;
  @Output() planSelected = new EventEmitter<any>(); // 👈 Add this
  plans = [
    {
      hours: 4,
      selected: false,
      selectedOption: '',
      options: [
        { name: 'Monthly', price: 500 },
        { name: 'Quarterly', price: 1440 },
        { name: 'Half Yearly', price: 2700 },
        { name: 'Annual', price: 4800 }
      ]
    },
    {
      hours: 6,
      selected: false,
      selectedOption: '',
      options: [
        { name: 'Monthly', price: 650 },
        { name: 'Quarterly', price: 1860 },
        { name: 'Half Yearly', price: 3420 },
        { name: 'Annual', price: 6600 }
      ]
    },
    {
      hours: 8,
      selected: false,
      selectedOption: '',
      options: [
        { name: 'Monthly', price: 800 },
        { name: 'Quarterly', price: 2340 },
        { name: 'Half Yearly', price: 4500 },
        { name: 'Annual', price: 8400 }
      ]
    },
    {
      hours: 10,
      selected: false,
      selectedOption: '',
      options: [
        { name: 'Monthly', price: 1000 },
        { name: 'Quarterly', price: 2880 },
        { name: 'Half Yearly', price: 5640 },
        { name: 'Annual', price: 10800 }
      ]
    },
    {
      hours: 14,
      selected: false,
      selectedOption: '',
      options: [
        { name: 'Monthly', price: 1200 },
        { name: 'Quarterly', price: 3450 },
        { name: 'Half Yearly', price: 6600 },
        { name: 'Annual', price: 12000 }
      ]
    }
  ];

  selectedPlan: any = null;
  totalAmount = 0;

  onPlanSelect(selectedPlan: any) {
    // unselect all others
    this.plans.forEach(plan => {
      if (plan !== selectedPlan) {
        plan.selected = false;
        plan.selectedOption = '';
      }
    });
    // reset values
    if (!selectedPlan.selected) {
      // 🔹 If user unticked this plan, clear everything
      selectedPlan.selectedOption = '';
      this.selectedPlan = null;
      this.totalAmount = 0;
    } else {
      // 🔹 When user ticks this plan again, reset selectedOption
      selectedPlan.selectedOption = '';
      this.selectedPlan = null;
      this.totalAmount = 0;
    } this.totalAmount = 0;
    this.planSelected.emit(this.selectedPlan);

  }
  selectedPlanData: any;

  onPlanSelected(plan: any) {
    this.selectedPlanData = plan;
  }

  selectOption(plan: any, opt: any) {
    plan.selectedOption = opt.name;
    this.selectedPlan = plan;
    this.totalAmount = opt.price;
    this.planSelected.emit({
      hours: plan.hours,
      type: opt.name,
      amount: opt.price
    });
  }
  scrollLeft() {
    this.cardContainer.nativeElement.scrollBy({ left: -400, behavior: 'smooth' });
  }

  scrollRight() {
    this.cardContainer.nativeElement.scrollBy({ left: 400, behavior: 'smooth' });
  }
}
