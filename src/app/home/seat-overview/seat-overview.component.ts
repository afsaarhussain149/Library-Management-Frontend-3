import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationsService, Options } from 'angular2-notifications';

interface SeatBooking {
  studentName: string;
  phone: string;
  shiftTime: string;
  endPlanDate: string;
}

interface Seat {
  seatNo: number;
  status: 'available' | 'booked';
  bookings: SeatBooking[];
}

@Component({
  selector: 'app-seat-overview',
  standalone: false,
  templateUrl: './seat-overview.component.html',
  styleUrl: './seat-overview.component.css'
})
export class SeatOverviewComponent implements OnInit {
  api: any = 'https://library-management-backend-3-62tq.onrender.com';

  loading = false;
  seats: Seat[] = [];

  summary = {
    totalSeats: 68,
    bookedSeatsCount: 0,
    availableSeatsCount: 0,
    totalActiveBookings: 0
  };

  // Which seat's booking details are currently expanded/shown
  selectedSeat: Seat | null = null;

  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 3000,
  };

  constructor(private http: HttpClient, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.fetchOverview();
  }

  fetchOverview() {
    this.loading = true;
    this.http.get<any>(`${this.api}/api/payments/seats/overview`).subscribe({
      next: (res) => {
        this.seats = res?.seats || [];
        this.summary = res?.summary || this.summary;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.message || 'Failed to load seat overview');
      }
    });
  }

  openSeat(seat: Seat) {
    this.selectedSeat = seat;
  }

  closeSeat() {
    this.selectedSeat = null;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  refresh() {
    this.fetchOverview();
  }
}