import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-complaint',
  standalone: false,
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent implements OnInit{

  selectedMessage: string = '';
  showMessageModal = false;

  constructor(private http: HttpClient,private notifications:NotificationsService) { }

  api: any = 'https://library-management-backend-3-62tq.onrender.com';
  users: any[] = [];
  page = 1;
  totalPages = 0;
  loading = false;
  usertotal: any
  today: Date = new Date();
  currentTime: string = '';
  complaints: any[] = [];
  ngOnInit(): void {
    this.fetchComplaints()
  }
  fetchComplaints() {
    this.loading=true
    this.http.get<any>(`${this.api}/api/complaint/complaints`).subscribe({
      next: (res) => {
        // interceptor complaint_id ko complaintId bana deta hai (Mongo ka _id nahi hai)
        this.complaints = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  notificationOptions: Options = {
    position: ['top', 'right'],   // 👈 always top-right of screen
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
   deletedata(id:any){
          this.loading=true

this.http.delete(`${this.api}/api/complaint/complaints/${id}`).subscribe({
    next:(res:any)=>{
      this.notifications.success(res.message);
      // refresh list
      this.loading=false
      this.fetchComplaints()
    },
    error:(err)=>{
      this.loading=false
      this.notifications.error(err.error?.message || "Approval failed");
    }
  })

  }

  openMessage(message: string) {
    this.selectedMessage = message;
    this.showMessageModal = true;
  }

  closeMessage() {
    this.showMessageModal = false;
    this.selectedMessage = '';
  }

}
