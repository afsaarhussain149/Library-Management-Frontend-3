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
  data: any = {};
  loading: boolean = false;

  ngOnInit(): void {
    const raw = sessionStorage.getItem('studentDATA');
    this.data = raw ? JSON.parse(raw) : {};

    console.log('studentDATA:', this.data);
    this.openEditProfile();
  }

  downloadForm() {
    window.print();
  }
  notificationOptions: Options = {
    position: ['top', 'right'],
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

    return `${year}-${month}-${day}`;
  }
  routeback() {
    this.Rout.navigate(['/home/students-details'])
  }

  openEditProfile() {
    // /api/auth/all-users?userId=X ka response: { success, total, data: [{...}] }
    // data.profile me wahi first object aayega
    const profile = this.data?.profile || {};
    const photoUrl = this.getPhotoUrl(profile.photo);

    // Remembers what's actually SAVED on the server right now, so removePhoto()
    // can tell "cancel an unsaved new selection" apart from "delete the real saved photo".
    this.originalPhotoUrl = photoUrl;

    this.form = {
      fullName: profile.full_name || this.data?.fullName || '',
      fatherName: profile.father_name || this.data?.fatherName || '',
      gender: profile.gender || this.data?.gender || '',
      createdAt: this.formatToMMDDYYYY(profile.createdAt),
      dob: this.formatToMMDDYYYY(profile.dob),
      email: profile.email || '',
      personalNumber: profile.personal_number || this.data?.phoneNumber || '',
      emergencyNumber: profile.emergency_number || this.data?.emergencyNumber || '',
      presentAddress: profile.present_address || this.data?.presentAddress || '',
      permanentAddress: profile.permanent_address || this.data?.permanentAddress || '',
      aadh: profile.aadhar_number || this.data?.aadharNumber || '',
      photo: photoUrl,
      seat: this.data?.payment?.seats?.[0],
      slot: this.data?.payment?.shift?.time,
      hour: this.data?.payment?.shift?.hour,
      password: ''
    };
  }

  private readonly API_BASE_URL = 'https://api.foujibookgardenlibrary.com';
  getPhotoUrl(photo: string | null | undefined): string {
    if (!photo) return '';
    if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
    return `${this.API_BASE_URL}${photo.startsWith('/') ? photo : '/' + photo}`;
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
  originalPhotoUrl: string = ''; // photo actually saved on the server right now
  constructor(private Rout: Router, private notifications: NotificationsService, private http: HttpClient) { }

  onImageSelect(event: any): void {
    this.selectedImage = event.target.files[0];

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.form.photo = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    // Case 1: an unsaved new photo was just picked (not saved yet) -
    // "Remove" here just cancels that pending selection.
    if (this.selectedImage) {
      this.selectedImage = null;
      this.form.photo = this.originalPhotoUrl;
      return;
    }

    // Case 2: no pending selection, so this IS the actual saved photo -
    // permanently delete it from Cloudinary + the database.
    if (!this.originalPhotoUrl) {
      return;
    }

    if (!confirm('Remove this photo permanently? This cannot be undone.')) {
      return;
    }

    this.loading = true;
    this.http.delete<any>(`${this.API_BASE_URL}/api/auth/user/remove-photo/${this.data.userId}`).subscribe({
      next: () => {
        this.loading = false;
        this.form.photo = '';
        this.originalPhotoUrl = '';
        this.notifications.success('Success', 'Photo removed successfully');
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.msg || 'Failed to remove photo');
      }
    });
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