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
  showForgot = false;

  // ---------- FORGOT PASSWORD ----------
    forgotEmail: string = '';
    otp: string = '';
    newPassword: string = '';
    confirmNewPassword: string = '';

    forgotStep: number = 1;

    showNewPassword = false;
    showConfirmNewPassword = false;

    otpVerified = false;
  // showResetPassword = false;
  // showConfirmPassword = false;

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

    this.email = '';
    this.password = '';

    this.forgotEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmNewPassword = '';

    this.forgotStep = 1;
    this.otpVerified = false;

    this.isFlipped = false;
    this.showForgot = false;
  }

  api: any = 'https://library-management-backend-3-62tq.onrender.com';

  sendForgotOtp() {

    if (!this.forgotEmail || !this.forgotEmail.trim()) {
      this.notificationsService.error(
        'Error',
        'Please enter your email address'
      );
      return;
    }

    const email = this.forgotEmail.trim().toLowerCase();

    this.loading = true;

    this.homeservice.forgotPassword({
      email: email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res.success) {

          this.forgotEmail = email;

          this.forgotStep = 2;

          this.notificationsService.success(
            'Success',
            'OTP has been sent to your email'
          );

        } else {

          this.notificationsService.error(
            'Error',
            res.message || 'Unable to send OTP'
          );
        }
      },

      error: (err: any) => {

        this.loading = false;

        this.notificationsService.error(
          'Error',
          err.error?.message || 'Unable to send OTP'
        );
      }
    });
  }

  verifyForgotOtp() {

    if (!this.otp || !this.otp.trim()) {

      this.notificationsService.error(
        'Error',
        'Please enter OTP'
      );

      return;
    }

    if (!/^\d{6}$/.test(this.otp.trim())) {

      this.notificationsService.error(
        'Error',
        'OTP must be 6 digits'
      );

      return;
    }

    this.loading = true;

    this.homeservice.verifyOtp({
      email: this.forgotEmail,
      otp: this.otp.trim()
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res.success) {

          this.otpVerified = true;

          this.forgotStep = 3;

          this.notificationsService.success(
            'Success',
            'OTP verified successfully'
          );

        } else {

          this.notificationsService.error(
            'Error',
            res.message || 'Invalid OTP'
          );
        }
      },

      error: (err: any) => {

        this.loading = false;

        this.notificationsService.error(
          'Error',
          err.error?.message || 'Invalid OTP'
        );
      }
    });
  }

  changeForgotPassword() {

    if (!this.otpVerified) {

      this.notificationsService.error(
        'Error',
        'Please verify OTP first'
      );

      return;
    }

    if (!this.newPassword || !this.confirmNewPassword) {

      this.notificationsService.warn(
        'Warning',
        'Please enter both password fields'
      );

      return;
    }

    if (this.newPassword.length < 6) {

      this.notificationsService.warn(
        'Warning',
        'Password must be at least 6 characters'
      );

      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {

      this.notificationsService.error(
        'Error',
        'Passwords do not match'
      );

      return;
    }

    this.loading = true;

    this.homeservice.resetPassword({

      email: this.forgotEmail,

      newPassword: this.newPassword

    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res.success) {

          this.notificationsService.success(
            'Success',
            'Password reset successfully'
          );

          this.flipToLogin();

        } else {

          this.notificationsService.error(
            'Error',
            res.message || 'Unable to reset password'
          );
        }
      },

      error: (err: any) => {

        this.loading = false;

        this.notificationsService.error(
          'Error',
          err.error?.message || 'Unable to reset password'
        );
      }
    });
  }

  onOtpInput(event: any) {

    event.target.value =
      event.target.value
        .replace(/[^0-9]/g, '')
        .slice(0, 6);

    this.otp = event.target.value;
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

    if (this.email == '8750583123') {
      sessionStorage.setItem("phone", this.email)
      this.homeservice.adminloginuser(adminpayload).subscribe({

        next: (data: any) => {
          this.loading = false;

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

          sessionStorage.setItem('userdata', JSON.stringify(data.user));
          this.notificationsService.success('Success', 'Login successful!');
          this.route.navigate(['/home/user']);




        },
        error: (err) => {
          this.loading = false;
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


  flipToForgot() {

    this.showForgot = true;

    this.forgotStep = 1;

    this.forgotEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmNewPassword = '';

    this.otpVerified = false;

    this.isFlipped = false;
  }
  
  showUnpaidCard() { this.route.navigate(['/unpaiduser']) } // flip 2nd side

  goToHome() { this.route.navigate(['/home']);}


}
