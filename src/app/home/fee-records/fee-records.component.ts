import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-fee-records',
  standalone: false,
  templateUrl: './fee-records.component.html',
  styleUrl: './fee-records.component.css'
})
export class FeeRecordsComponent implements OnInit {
  api: any = 'https://library-management-backend-3-62tq.onrender.com';

  loading = false;
  rows: any[] = [];
  total = 0;
  totalAmount = 0;

  // Pagination
  page = 1;
  totalPages = 0;

  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 3000,
  };

  // Filters: student name, phone no, payment mode, month of payment,
  // and month/year of plan EXPIRY
  filters = {
    studentName: '',
    phone: '',
    paymentMode: '',   // '' = all, else 'online' | 'cash'
    month: '',          // '' = all months, else '1'..'12' (payment month)
    expireMonth: '',     // '' = all months, else '1'..'12' (expiry month)
    expireYear: ''       // '' = all years, else e.g. '2026'
  };

  years: number[] = [];

  months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  constructor(private http: HttpClient, private notifications: NotificationsService) {
    // Build a small dropdown of years: 2 years back to 2 years ahead
    const current = new Date().getFullYear();
    for (let y = current - 2; y <= current + 2; y++) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.fetchFeeRecords(1);
  }

  applyFilter() {
    this.fetchFeeRecords(1);
  }

  clearFilter() {
    this.filters = { studentName: '', phone: '', paymentMode: '', month: '', expireMonth: '', expireYear: '' };
    this.fetchFeeRecords(1);
  }

  fetchFeeRecords(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;

    this.loading = true;

    let params = new HttpParams().set('page', page);
    if (this.filters.studentName) {
      params = params.set('studentName', this.filters.studentName);
    }
    if (this.filters.phone) {
      params = params.set('phone', this.filters.phone);
    }
    if (this.filters.paymentMode) {
      params = params.set('paymentMode', this.filters.paymentMode);
    }
    if (this.filters.month) {
      params = params.set('month', this.filters.month);
    }
    if (this.filters.expireMonth) {
      params = params.set('expireMonth', this.filters.expireMonth);
    }
    if (this.filters.expireYear) {
      params = params.set('expireYear', this.filters.expireYear);
    }

    this.http.get<any>(`${this.api}/api/payments/fee-records`, { params }).subscribe({
      next: (res) => {
        this.rows = res?.data || [];
        this.total = res?.total || 0;
        this.page = res?.page || 1;
        this.totalPages = res?.totalPages || 0;
        this.totalAmount = this.rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.message || 'Failed to load fee records');
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  openSms(row: any) {
    if (!row?.phone) {
      this.notifications.error('Error', 'No phone number found for this student');
      return;
    }

    const message =
      `Dear ${row.studentName}, this is a reminder from Fouji Book Garden Library. ` +
      `Your membership plan is set to expire on ${this.formatDate(row.expireDate)}. ` +
      `Kindly renew your payment at the earliest to avoid any interruption in your ` +
      `library access. Thank you for being a valued member.`;

    const encodedMessage = encodeURIComponent(message);

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIos ? '&' : '?';

    const smsUrl = `sms:${row.phone}${separator}body=${encodedMessage}`;
    window.open(smsUrl, '_self');
  }

  openWhatsApp(row: any) {
    if (!row?.phone) {
      this.notifications.error('Error', 'No phone number found for this student');
      return;
    }

    let phone = row.phone.toString().replace(/\D/g, '');
    if (phone.length === 10) {
      phone = '91' + phone;
    }

    const message =
      `Dear *${row.studentName}*,\n\n` +
      `This is a friendly reminder from *Fouji Book Garden Library*.\n\n` +
      `Your membership plan is set to expire on *${this.formatDate(row.expireDate)}*. ` +
      `Kindly renew your payment at the earliest to avoid any interruption in your seat and library access.\n\n` +
      `Thank you for being a valued member.\n\n` +
      `Regards,\n*Fouji Book Garden Library*`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  }
}