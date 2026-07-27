import { Component } from '@angular/core';
import { homeService } from '../../shared/api-client/home.services';
import { NotificationsService } from 'angular2-notifications';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
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

  showPassword = false;
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
          this.notificationsService.error('Error', err.error.message);
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
    this.email = ''
    this.password = ''
    this.isFlipped = false;
    this.showForgot = false;
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
    const adminpayload = {
      phone: this.email,
      password: this.password
    };

    this.loading = true;
    console.log(adminpayload, "djdjdj");

    if (this.email == '8750583123') {
      sessionStorage.setItem("phone", this.email)
      this.homeservice.adminloginuser(adminpayload).subscribe({

        next: (data: any) => {
          this.loading = false;

          console.log("Login Response:", data);

          // Store full response
          sessionStorage.setItem('userdata', JSON.stringify(data));

          // Or store only token
          sessionStorage.setItem('token', data.token);
          this.notificationsService.success('Admin', 'Login successful!');

          // Navigate
          this.route.navigate(['/home/admin']);
        },

        error: (err: any) => {
          this.loading = false;

          console.error("Login Error:", err);
          this.notificationsService.error('Error', err.error.message);
        },

        complete: () => {
          console.log("Login request completed");
        }

      });

    } else {
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
          if (err.error.paymentStatus == 'not-paid') {

            // sessionStorage.setItem('takeuserdetails',JSON.stringify(userdatabaic))
            sessionStorage.setItem('takeuserdetails', JSON.stringify(err.error.user));
            this.notificationsService.warn('Warning', 'Please fill plan and payment to take seat !');
            this.notificationsService.error('Error', err.error.msg);

            this.route.navigate(['/home/seat-booking'])
          } else {

            this.notificationsService.error('Error', err.error.msg);
          }
        }
      });

    }
  }
  showForgot = false;


  flipToForgot() { this.route.navigate(['/register']) } // flip 2nd side
  showUnpaidCard() { this.route.navigate(['/unpaiduser']) } // flip 2nd side


}
