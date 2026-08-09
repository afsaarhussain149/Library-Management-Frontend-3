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

  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 3000,
  };

  // Filters: student name, phone no, payment mode, month of payment
  filters = {
    studentName: '',
    phone: '',
    paymentMode: '',   // '' = all, else 'online' | 'cash'
    month: ''          // '' = all months, else '1'..'12'
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
    this.fetchFeeRecords();
  }

  applyFilter() {
    this.fetchFeeRecords();
  }

  clearFilter() {
    this.filters = { studentName: '', phone: '', paymentMode: '', month: '' };
    this.fetchFeeRecords();
  }

  fetchFeeRecords() {
    this.loading = true;

    let params = new HttpParams();
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

    this.http.get<any>(`${this.api}/api/payments/fee-records`, { params }).subscribe({
      next: (res) => {
        this.rows = res?.data || [];
        this.total = res?.total || 0;
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
}