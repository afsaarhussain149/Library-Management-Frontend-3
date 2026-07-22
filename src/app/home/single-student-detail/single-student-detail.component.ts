import { Component, OnInit } from '@angular/core';
import { NotificationsService, Options, } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-single-student-detail',
  standalone: false,
  templateUrl: './single-student-detail.component.html',
  styleUrl: './single-student-detail.component.css'
})
export class SingleStudentDetailComponent implements OnInit {
  data: any
  loading: boolean = false;
  ngOnInit(): void {
    this.data = JSON.parse(sessionStorage.getItem('studentDATA') || '')

    console.log(this.data);
    this.openEditProfile()

  }

  downloadForm() {
    window.print();
  }
  notificationOptions: Options = {
    position: ['top', 'right'],   // 👈 always top-right of screen
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
  formatToMMDDYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // MUST be yyyy-MM-dd
  }
  routeback() {
    this.Rout.navigate(['/home/students-details'])
  }
  openEditProfile() {
    // Note: backend ki students-list query me fatherName, gender, dob,
    // emergencyNumber, addresses, aadh, photo columns select hi nahi hote
    // (sirf listing ke liye banayi gayi query hai), isliye yeh fields yahan
    // khaali aayenge jab tak backend me ek "get full user by id" endpoint
    // add na ho. Crash na ho isliye sab jagah safe defaults use kar rahe hain.
    this.form = {
      fullName: this.data.fullName,
      fatherName: this.data.fatherName || '',
      gender: this.data.gender || '',
      createdAt: this.formatToMMDDYYYY(this.data.createdAt),
      dob: this.formatToMMDDYYYY(this.data.dob),
      email: this.data.email || '',
      personalNumber: this.data.personalNumber || '',
      emergencyNumber: this.data.emergencyNumber || '',
      presentAddress: this.data.presentAddress || '',
      permanentAddress: this.data.permanentAddress || '',
      aadh: this.data.aadh || '',
      photo: this.data.photo || '',
      seat: this.data.payment?.seats?.[0],
      slot: this.data.payment?.shift?.time,
      hour: this.data.payment?.shift?.hour,
      password: ''
    };

  }
  form: any = {
    fullName: '',
    fatherName: '',
    gender: '',
    dob: '',
    email: '',
    personalNumber: '',
    emergencyNumber: '',
    presentAddress: '',
    permanentAddress: '',
    aadh: '',
    password: ''
  };
  selectedImage: File | null = null;
  constructor(private Rout: Router, private notifications: NotificationsService, private http: HttpClient) { }

  onImageSelect(event: any): void {
    this.selectedImage = event.target.files[0];

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // validate image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.form.photo = reader.result as string; // base64 preview
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.form.photo = '';
  }
  updateProfile() {
    const formData = new FormData();

    formData.append('userId', this.data.userId);
    formData.append('fullName', this.form.fullName);
    formData.append('fatherName', this.form.fatherName);
    formData.append('gender', this.form.gender);
    formData.append('dob', this.form.dob);
    formData.append('email', this.form.email);
    formData.append('personalNumber', this.form.personalNumber);
    formData.append('emergencyNumber', this.form.emergencyNumber);
    formData.append('presentAddress', this.form.presentAddress);
    formData.append('permanentAddress', this.form.permanentAddress);
    formData.append('aadh', this.form.aadh);

    if (this.form.password) {
      formData.append('password', this.form.password);
    }

    if (this.selectedImage) {
      formData.append('photo', this.selectedImage);
    }

    this.loading = true;

    this.http.put('https://api.foujibookgardenlibrary.com/api/auth/user/edit-profile', formData).subscribe({
      next: (res: any) => {
        this.notifications.success('Success', 'Profile updated successfully');
        sessionStorage.setItem('userdata', JSON.stringify("helo"));
        debugger
        this.Rout.navigate(['/home/students-details']);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.msg || 'Update failed');
      }
    });
  }
}
