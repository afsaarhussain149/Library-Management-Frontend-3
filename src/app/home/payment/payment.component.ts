import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  @Input() selectedPlan: any; // receives plan from parent
  @Input() fullplandetails: any; // receives plan from parent
  registrationFee = 200;
  totalAmount = 0;

  ngOnInit() {
    console.log(this.fullplandetails);
    
    if (this.selectedPlan) {
      this.totalAmount =  this.selectedPlan.amount;
    }
  }
}
