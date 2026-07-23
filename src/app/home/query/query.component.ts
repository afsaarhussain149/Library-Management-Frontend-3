import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationsService, Options } from 'angular2-notifications';

HttpClient
@Component({
  selector: 'app-query',
  standalone: false,
  templateUrl: './query.component.html',
  styleUrl: './query.component.css'
})
export class QueryComponent implements OnInit {
  queries: any[]=[];
constructor(private http:HttpClient,private notifications:NotificationsService){
  
}
  api: any = 'https://library-management-backend-3-62tq.onrender.com';
  loading = false;

 loadQueries() {
    this.http.get(`${this.api}/api/query`).subscribe((res:any) => {
      this.queries = res.data ;
      console.log(this.queries);
      
    });
  }
  ngOnInit(): void {
    this.loadQueries()
  }
  deletedata(id:any){
          this.loading=true

this.http.delete(`${this.api}/api/query/${id}`).subscribe({
    next:(res:any)=>{
      console.log(res);
      this.notifications.success(res.message);
      // refresh list
      this.loading=false
      this.loadQueries()
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
}
