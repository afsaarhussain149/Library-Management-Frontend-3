import { Component } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { homeService } from '../shared/api-client/home.services';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  regpassword: any;
  confirmPassword: any;
  constructor(
    private homeservice: homeService,
    private notificationsService: NotificationsService,
    private http: HttpClient,
    private route: Router
  ) {
    sessionStorage.clear()
  }

  // ---------- LOGIN VARIABLES ----------
  email: string = '';
  password: string = '';
  username: any
  phoneno: any

  showResetPassword = false;
  showConfirmPassword = false;

  onPhoneInput(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    this.phoneno = event.target.value;
  }
  submitbasic() {
    if (!this.username || !this.phoneno) {
      this.notificationsService.error('Error', 'Name and Phone are required');
      return;
    }

    if (this.phoneno.length !== 10) {
      this.notificationsService.error('Error', 'Phone number must be 10 digits');
      return;
    }
    let payload = {
      "fullName": this.username,
      "phoneNumber": this.phoneno
    }
    this.loading = true;

    this.homeservice.basicdetailsuser(payload).subscribe(
      {
        next: (data: any) => {
          this.http.post<any>(`${this.api}/api/auth/unpaid-user`, { phoneNumber: this.phoneno }).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notificationsService.success('Success', 'Form submitted successfully');
              sessionStorage.setItem('takeuserdetails', JSON.stringify(res.user));
              this.route.navigate(['/home/seat-booking'])
            },
            error: (err) => {
              this.loading = false;
              this.notificationsService.error('Error', err.error?.msg || 'Something went wrong');
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.notificationsService.error('Error', err.error.msg);
        }
      })
  }
  // ---------- COMMON ----------
  loading = false;
  decodedToken: any;
  isFlipped: boolean = false;

  flipToRegister() {
    this.username = ''
    this.phoneno = ''
    this.isFlipped = true;
    this.showForgot = false;
  }

  flipToLogin() {
    this.route.navigate(['/login'])
    this.email = ''
    this.password = ''

  }
  resetPhone: any;
  resetPassword: any;
  api: any = 'https://library-management-backend-3-62tq.onrender.com';

  resetPasswordApi() {
    if (!this.resetPhone || !this.resetPassword || !this.confirmPassword) {
      this.notificationsService.warn("All fields required");
      return;
    }

    if (this.resetPassword !== this.confirmPassword) {
      this.notificationsService.error("Passwords do not match");
      return;
    }


    this.loading = true
    this.http.post(`${this.api}/api/auth/reset-password`, {
      phoneNumber: this.resetPhone,
      newPassword: this.resetPassword
    }).subscribe(res => {
      this.notificationsService.success("Password updated successfully");
      this.resetPhone = "";
      this.resetPassword = "";
      this.confirmPassword = "";
      this.flipToLogin();

      this.loading = false
    }, err => {
      this.loading = false

      this.notificationsService.error(err.error?.msg || "Something went wrong");
    });
  }

  // ---------- LOGIN API ----------
  loginapi() {
    if (!this.email || !this.password) {
      this.notificationsService.error('Error', 'phoneNumber and password are mandatory!');
      return;
    }

    const payload = {
      phoneNumber: this.email,
      password: this.password
    };

    this.loading = true;

    this.homeservice.loginuser(payload).subscribe({
      next: (data: any) => {
        this.loading = false;
        console.log('Login Response:', data);


        sessionStorage.setItem('userdata', JSON.stringify(data.user));
        this.notificationsService.success('Success', 'Login successful!');
        this.route.navigate(['/home/user']);

      },
      error: (err) => {
        this.loading = false;
        console.error('Login Error:', err);
        this.notificationsService.error('Error', err.error.msg);
      }
    });
  }
  showForgot = false;


  flipToForgot() { this.showForgot = true; this.isFlipped = true; } // flip 2nd side


}
