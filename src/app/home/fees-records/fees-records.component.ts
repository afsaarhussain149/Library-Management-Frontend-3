import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-fees-records',
  standalone: false,
  templateUrl: './fees-records.component.html',
  styleUrl: './fees-records.component.css'
}) 
export class FeesRecordsComponent implements OnInit {
    api: any = 'https://api.foujibookgardenlibrary.com';
      page = 1;
  totalPages = 0;
  loading = false;
  usertotal: any
      constructor(private http: HttpClient,private notifications:NotificationsService) { }
users:any[]=[]
ngOnInit(): void {
  this.fetchpayment(1)
}
viewUser(data:any){
  // approve/{id} backend me actually app_user ka user_id expect karta hai
  let userid = data.userId;
      this.loading = true;

  this.http.patch<any>(`${this.api}/api/payments/approve/${userid}`,{})
  .subscribe({
    next:(res)=>{
      console.log(res);
      this.notifications.success(res.message);
      // refresh list
      this.fetchpayment(1);  
      this.loading=false
    },
    error:(err)=>{
      console.log("Error:",err);
      this.loading=false
      this.notifications.error(err.error?.message || "Approval failed");
    }
  })
}
notificationOptions: Options = {
    position: ['top', 'right'],   // 👈 always top-right of screen
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
fetchpayment(page: number){
      this.loading = true;
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;

    this.http.get<any>(`${this.api}/api/payments/pending-cash-users/${page}`)
      .subscribe(res => {
        // Backend flat columns deta hai (paymentId, amount, planHours, planType,
        // status, paymentCreatedAt) — template nested `u.payment.xxx` expect
        // karta hai, isliye yahan map karte hain.
        this.users = (res.data || []).map((u: any) => ({
          ...u,
          payment: {
            paymentId: u.paymentId,
            amount: u.amount,
            status: u.status,
            plan: { hours: u.planHours, type: u.planType },
            createdAt: u.paymentCreatedAt
          }
        }));
        console.log(this.users);
        this.page = res.page;
        this.usertotal = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
}
}
