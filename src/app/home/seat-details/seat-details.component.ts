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
  // number, with a professional reminder message already typed into the
  // body - the admin just has to hit Send.
  //
  // Note: SMS is a PLAIN TEXT protocol - it has no concept of bold or
  // font size, on any phone or carrier. There is no way to make part of
  // an SMS body bold/bigger; that's a hard platform limitation, not a
  // missing feature here.
  openSms(row: any) {
    if (!row?.phone) {
      this.notifications.error('Error', 'No phone number found for this student');
      return;
    }

    const message =
      `Dear ${row.student_name}, this is a reminder from Fouji Book Garden Library. ` +
      `Your membership plan is set to expire on ${this.formatDate(row.expire_date)}. ` +
      `Kindly renew your payment at the earliest to avoid any interruption in your ` +
      `library access. Thank you for being a valued member.`;

    const encodedMessage = encodeURIComponent(message);

    // The sms: URI's separator before "body=" differs by platform -
    // iOS wants "&", Android/desktop want "?". Using the wrong one
    // silently drops the pre-filled text on some devices.
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIos ? '&' : '?';

    const smsUrl = `sms:${row.phone}${separator}body=${encodedMessage}`;
    window.open(smsUrl, '_self');
  }

  // Opens WhatsApp (app on mobile, WhatsApp Web on desktop) with a chat
  // to this student's number already open, and a professional reminder
  // pre-filled in the input box. WhatsApp DOES support light formatting
  // via plain-text markers: wrapping a word in *asterisks* renders it
  // bold once the message is actually sent/viewed in WhatsApp - but,
  // like SMS, there is no way to change font SIZE; WhatsApp (and every
  // major messaging app) simply doesn't expose that.
  openWhatsApp(row: any) {
    if (!row?.phone) {
      this.notifications.error('Error', 'No phone number found for this student');
      return;
    }

    // wa.me requires the number WITH country code and no symbols/spaces.
    // Our stored numbers are plain 10-digit Indian numbers, so we prefix
    // 91 - adjust here if the library ever serves non-Indian numbers.
    let phone = row.phone.toString().replace(/\D/g, '');
    if (phone.length === 10) {
      phone = '91' + phone;
    }

    const message =
      `Dear *${row.student_name}*,\n\n` +
      `This is a friendly reminder from *Fouji Book Garden Library*.\n\n` +
      `Your membership plan is set to expire on *${this.formatDate(row.expire_date)}*. ` +
      `Kindly renew your payment at the earliest to avoid any interruption in your seat and library access.\n\n` +
      `Thank you for being a valued member.\n\n` +
      `Regards,\n*Fouji Book Garden Library*`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  }
}









