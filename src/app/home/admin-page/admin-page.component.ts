import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { homeService } from '../../shared/api-client/home.services';
import { Router } from '@angular/router';
import { NotificationsService,Options } from 'angular2-notifications';

interface Students {
  studentId: number;
  image: string;
  name: string;
  price: string;

  status: 'Confirmed' | 'Cancelled';
  progressColor: string;
  progressValue: number;
  statusColor: string;
  shiftDate: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: false,
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  api: any = 'https://library-management-backend-3-62tq.onrender.com';
  users: any[] = [];
  page = 1;
  notificationOptions: Options = {
      position: ['top', 'right'],   // 👈 always top-right of screen
      timeOut: 4000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      maxLength: 200
    };
  totalPages = 0;
  loading = false;
  usertotal: any
  today: Date = new Date();
  currentTime: string = '';
  activeCount: any;
  inactiveCount: any;
  totalUsers: any;
sessiondata:any
adminname:any
adminId: any;
adminphone: any;
adminImage: any;

editName = '';
editPhone = '';
editPassword = '';
selectedFile: any;
showEdit = false;



toggleEdit() {
  this.showEdit = !this.showEdit;

  this.editName = this.adminname;
  this.editPhone = this.adminphone;
}

// onFileChange(event: any) {
//   this.selectedFile = event.target.files[0];
// }

updateProfile1() {
  const formData = new FormData();

  formData.append('name', this.editName);
  formData.append('phone', this.editPhone);

  if (this.editPassword) {
    formData.append('password', this.editPassword);
  }

  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }

  this.homeService.updateProfile(this.adminId, formData)
    .subscribe({
      next: (res: any) => {
            this.notificationsService.success(res.message);

        // Backend admin-edit-profile response sirf {success, message} deta
        // hai, updated admin object nahi — isliye jo values submit kiye the
        // wahi UI me use kar rahe hain.
        this.adminname = this.editName;
        this.adminphone = this.editPhone;

        this.showEdit = false;
      },
      error: (err: any) => {
        this.notificationsService.error(err.error?.message || "Update failed");
      }
    });
}
adminphoto:any
  constructor(private http: HttpClient,private homeService:homeService,private router:Router,    private notificationsService: NotificationsService,
) { }
showProfileModal = false;




onFileChange(event: any) {
  const file = event.target.files[0];

  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.adminImage = e.target.result;  // 👈 preview image
    };

    reader.readAsDataURL(file);
  }
}
openmodal(){
  this.showProfileModal=true
}
data:any
updateProfile() {
  const formData = new FormData();
this.data =sessionStorage.getItem('phone')
  formData.append('name', this.editName);
  formData.append('phone',this.data );

  if (this.editPassword) {
    formData.append('password', this.editPassword);
  }

  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }
        this.loading = true;

  this.homeService.updateProfile(this.adminId, formData)
    .subscribe({
      next: (res: any) => {
         console.log("jjdjdj");
         
  this.loading = false;

        // Backend admin-edit-profile response sirf {success, message} deta
        // hai — jo values submit kiye the wahi UI me use kar rahe hain.
        this.adminname = this.editName;
        this.adminphone = this.data;

        this.showProfileModal = false;
                 this.notificationsService.success('success',res.message);

      },
      error: (err: any) => {
                this.loading = false;

         this.notificationsService.error(err.error?.message || "Update failed");
      }
    });
}
  ngOnInit() {
    this.sessiondata = JSON.parse(sessionStorage.getItem('userdata') || '')
    this.adminname=this.sessiondata.data.name
    this.adminphone=this.sessiondata.data.phone
    this.adminImage=this.sessiondata.data.image
    this.loadPage(1);
    this.fetchComplaints();
      this.getUserStatusCount();

    this.updateClock();
    setInterval(() => {
      this.updateClock();
    }, 1000);

  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
getUserStatusCount() {
  this.http
    .get<any>(`${this.api}/api/payments/users-status-count`)
    .subscribe(res => {
      console.log(res);
      
      this.activeCount = res.activeCount;
      this.inactiveCount = res.inactiveCount;
      this.totalUsers = res.total;
    });
}

  complaints: any = 0;
  fetchComplaints() {
    this.http.get<any>(`${this.api}/api/complaint/complaints`).subscribe({
      next: (res) => {
        this.complaints = res.count || 0;
        console.log(this.complaints);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
fetchpayment(){
      this.loading = true;

    this.http.get<any>(`${this.api}/api/payments/pending-cash`)
      .subscribe(res => {
      console.log(res);
      
        this.loading = false;
      }, () => {
        this.loading = false;
      });
}
  loadPage(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;

    this.loading = true;

    this.http.get<any>(`${this.api}/api/payments/users-with-payments/${page}`)
      .subscribe(res => {
        this.users = res.data;
        this.page = res.page;
        this.usertotal = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }
}


