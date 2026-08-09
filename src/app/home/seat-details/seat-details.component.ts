import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-seat-details',
  standalone: false,
  templateUrl: './seat-details.component.html',
  styleUrl: './seat-details.component.css'
})
export class SeatDetailsComponent implements OnInit {
  api: any = 'https://library-management-backend-3-62tq.onrender.com';

  loading = false;
  rows: any[] = [];
  total = 0;

  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 3000,
  };

  // Filters: student name, phone no, seat no, and month of expire date
  filters = {
    studentName: '',
    phone: '',
    seatNo: '',
    month: ''   // '' = all months, else '1'..'12'
  };

  months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  constructor(private http: HttpClient, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.fetchSeatDetails();
  }

  applyFilter() {
    this.fetchSeatDetails();
  }

  clearFilter() {
    this.filters = { studentName: '', phone: '', seatNo: '', month: '' };
    this.fetchSeatDetails();
  }

  fetchSeatDetails() {
    this.loading = true;

    let params = new HttpParams();
    if (this.filters.studentName) {
      params = params.set('studentName', this.filters.studentName);
    }
    if (this.filters.phone) {
      params = params.set('phone', this.filters.phone);
    }
    if (this.filters.seatNo) {
      params = params.set('seatNo', this.filters.seatNo);
    }
    if (this.filters.month) {
      params = params.set('month', this.filters.month);
    }

    this.http.get<any>(`${this.api}/api/payments/seat-details`, { params }).subscribe({
      next: (res) => {
        this.rows = res?.data || [];
        this.total = res?.total || 0;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.message || 'Failed to load seat details');
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  // Opens the phone's native SMS app, pre-addressed to this student's
  // number, with a friendly reminder message already typed into the
  // body - the admin just has to hit Send.
  openSms(row: any) {
    if (!row?.phone) {
      this.notifications.error('Error', 'No phone number found for this student');
      return;
    }

    const message =
      `Fouji Book Garden Library: Namaste ${row.student_name}, ` +
      `aapka library plan ${this.formatDate(row.expire_date)} ko expire ho raha hai. ` +
      `Kripya jaldi apni fee jama karayein. Dhanyavaad.`;

    const encodedMessage = encodeURIComponent(message);

    // The sms: URI's separator before "body=" differs by platform -
    // iOS wants "&", Android/desktop want "?". Using the wrong one
    // silently drops the pre-filled text on some devices.
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIos ? '&' : '?';

    const smsUrl = `sms:${row.phone}${separator}body=${encodedMessage}`;
    window.open(smsUrl, '_self');
  }
}









