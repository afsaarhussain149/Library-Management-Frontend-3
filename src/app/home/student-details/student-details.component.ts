import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NotificationsService, Options, } from 'angular2-notifications';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';

interface Students {
  studentId: number;
  image: string;
  name: string;
  price: string;

  status: 'Confirmed' | 'Cancelled';
  progressColor: string;
  progressValue: number;
  statusColor: string;
  shiftDate: string;
}

const SHIFT_GROUPS: { label: string; times: string[] }[] = [
  { label: '4 Hrs', times: ['8:00 AM - 12:00 PM', '10:00 AM - 2:00 PM', '12:00 PM - 4:00 PM', '2:00 PM - 6:00 PM', '4:00 PM - 8:00 PM', '6:00 PM - 10:00 PM'] },
  { label: '6 Hrs', times: ['8:00 AM - 2:00 PM', '10:00 AM - 4:00 PM', '12:00 PM - 6:00 PM', '2:00 PM - 8:00 PM', '4:00 PM - 10:00 PM'] },
  { label: '8 Hrs', times: ['8:00 AM - 4:00 PM', '10:00 AM - 6:00 PM', '12:00 PM - 8:00 PM', '2:00 PM - 10:00 PM'] },
  { label: '10 Hrs', times: ['8:00 AM - 6:00 PM', '10:00 AM - 8:00 PM', '12:00 PM - 10:00 PM'] },
  { label: '14 Hrs', times: ['8:00 AM - 10:00 PM'] },
];

@Component({
  selector: 'app-student-details',
  standalone: false,
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent {
  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
  api: any = 'https://library-management-backend-3-62tq.onrender.com';
  users: any[] = [];
  page = 1;
  totalPages = 0;
  loading = false;
  usertotal: any
  today: Date = new Date();
  currentTime: string = '';

  constructor(private http: HttpClient, private router: Router, private notifiaction: NotificationsService) { }
  ngOnInit() {
    this.loadPage(1);
  }

  filters = {
    userId: null,
    fullName: '',
    phone: '',
    active: false,
    inactive: false,
    unpaid: false
  };

  applyFilter() {
    this.page = 1; // reset pagination
    this.loadPage(this.page);
  }

  onFilterCheckboxChange(changed: 'active' | 'inactive' | 'unpaid') {
    if (changed === 'active' && this.filters.active) {
      this.filters.inactive = false;
      this.filters.unpaid = false;
    } else if (changed === 'inactive' && this.filters.inactive) {
      this.filters.active = false;
      this.filters.unpaid = false;
    } else if (changed === 'unpaid' && this.filters.unpaid) {
      this.filters.active = false;
      this.filters.inactive = false;
    }
    this.applyFilter();
  }

  formatToMMDDYYYY(dateStr: string): string {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  clearFilter() {
    this.filters = {
      userId: null,
      fullName: '',
      phone: '',
      active: false,
      inactive: false,
      unpaid: false
    };
    this.applyFilter();
  }
  exportToExcel() {

    let params = new HttpParams();

    if (this.filters.userId) {
      params = params.set('userId', this.filters.userId);
    }

    if (this.filters.fullName) {
      params = params.set('fullName', this.filters.fullName);
    }

    if (this.filters.phone) {
      params = params.set('phone', this.filters.phone);
    }

    if (this.filters.unpaid) {
      params = params.set('status', 'unpaid');
    }
    else if (this.filters.active && !this.filters.inactive) {
      params = params.set('status', 'active');
    }
    else if (!this.filters.active && this.filters.inactive) {
      params = params.set('status', 'inactive');
    }

    this.http.get<any>(`${this.api}/api/payments/users-with-payments-all`, { params })
      .subscribe(res => {

        const data = res.data.map((u: any) => ({
          UserID: u.userId,
          Name: u.fullName,
          Phone: u.phoneNumber,
          Status: u.paymentIsActive ? 'Active' : 'Inactive',
          PaymentStatus: u.paymentStatus || 'N/A',
          CreatedAt: u.paymentCreatedAt ? this.formatToMMDDYYYY(u.paymentCreatedAt) : 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        saveAs(blob, 'Users.xlsx');
      });
  }
  loadPage(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;

    this.loading = true;

    let params = new HttpParams();

    if (this.filters.userId) {
      params = params.set('userId', this.filters.userId);
    }

    if (this.filters.fullName) {
      params = params.set('fullName', this.filters.fullName);
    }

    if (this.filters.phone) {
      params = params.set('phone', this.filters.phone);
    }

    if (this.filters.unpaid) {
      params = params.set('status', 'unpaid');
    }
    else if (this.filters.active && !this.filters.inactive) {
      params = params.set('status', 'active');
    }
    else if (!this.filters.active && this.filters.inactive) {
      params = params.set('status', 'inactive');
    }

    this.http
      .get<any>(
        `${this.api}/api/payments/users-with-payments/${page}`,
        { params }
      )
      .subscribe(
        res => {
          this.users = (res.data || []).map((u: any) => ({
            ...u,
            payment: u.paymentId ? {
              paymentId: u.paymentId,
              status: u.paymentStatus,
              isActive: u.paymentIsActive,
              plan: { hours: u.planHours, type: u.planType },
              seats: typeof u.seats === 'string' && u.seats.length
                ? u.seats.split(',').map((s: string) => Number(s.trim()))
                : [],
              shift: { label: u.shiftLabel, time: u.shiftTime },
              createdAt: u.paymentCreatedAt
            } : null
          }));
          this.page = res.page;
          this.usertotal = res.total;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

  showStatusModal = false;
  selectedUser: any;

  openStatusModal(user: any) {
    this.selectedUser = user;
    this.showStatusModal = true;
  }

  // -------------------- CHANGE SEAT (Admin) --------------------
  showSeatModal = false;
  seatChangeError: string = '';
  seatChangeLoading = false;
  seatStatusLoading = false;
  seatStatusList: { seatNo: number; status: 'available' | 'booked' | 'current' }[] = [];
  selectedSeats: number[] = [];

  // -------------------- CHANGE TIME (Admin, part of seat edit) --------------------
  currentShiftLabel: string | null = null;   // student's original duration group (e.g. "6 Hrs")
  currentShiftTime: string | null = null;    // student's original time slot
  selectedShiftLabel: string | null = null;  // time group actually being applied
  selectedShiftTime: string | null = null;   // time slot actually being applied
  timeOptions: { time: string; available: boolean }[] = [];
  timeOptionsLoading = false;
  timeChangePossible = false; // true only if some OTHER time slot is actually free for the chosen seat

  openSeatModal(user: any) {
    this.selectedUser = user;
    this.seatChangeError = '';
    const currentSeats: number[] = user.payment?.seats || [];
    this.selectedSeats = currentSeats.length ? [currentSeats[0]] : [];
    this.seatStatusList = [];

    this.currentShiftLabel = user.payment?.shift?.label || null;
    this.currentShiftTime = user.payment?.shift?.time || null;
    this.selectedShiftLabel = this.currentShiftLabel;
    this.selectedShiftTime = this.currentShiftTime;
    this.timeOptions = [];
    this.timeChangePossible = false;

    this.showSeatModal = true;
    this.loadSeatAvailability(user);
    if (this.selectedSeats.length) {
      this.loadTimeOptionsForSeat(this.selectedSeats[0]);
    }
  }

  closeSeatModal() {
    this.showSeatModal = false;
    this.seatChangeError = '';
  }
  loadTimeOptionsForSeat(seatNo: number) {
    this.timeOptions = [];
    this.timeChangePossible = false;

    const group = SHIFT_GROUPS.find(g => g.label === this.currentShiftLabel);
    if (!seatNo || !group || !this.selectedUser?.userId) return;

    this.timeOptionsLoading = true;
    const checks = group.times.map(time =>
      this.http.get<any>(`${this.api}/api/payments/seat/check`, {
        params: {
          seatNo: String(seatNo),
          shift: time,
          excludeUserId: String(this.selectedUser.userId)
        }
      })
    );

    forkJoin(checks).subscribe({
      next: (results: any[]) => {
        this.timeOptions = group.times.map((time, i) => ({ time, available: !!results[i]?.success }));
        this.timeChangePossible = this.timeOptions.some(t => t.available && t.time !== this.currentShiftTime);

        // if the currently chosen time is no longer valid for this seat, fall back to current time
        const stillValid = this.timeOptions.find(t => t.time === this.selectedShiftTime && t.available);
        if (!stillValid) {
          this.selectedShiftLabel = this.currentShiftLabel;
          this.selectedShiftTime = this.currentShiftTime;
        }
        this.timeOptionsLoading = false;
      },
      error: () => {
        this.timeOptions = [];
        this.timeChangePossible = false;
        this.timeOptionsLoading = false;
      }
    });
  }

  selectTime(opt: { time: string; available: boolean }) {
    if (!this.timeChangePossible || !opt.available) return;
    if (this.selectedShiftTime === opt.time) return;

    this.selectedShiftLabel = this.currentShiftLabel;
    this.selectedShiftTime = opt.time;
    this.seatChangeError = '';
    // seat grid availability depends on the time slot, so refresh it for the new time
    this.loadSeatAvailability(this.selectedUser, opt.time);
  }

  // Fetches live seat status for this student's shift and marks the
  // student's own current seat(s) separately from seats booked by others.
  loadSeatAvailability(user: any, overrideShiftTime?: string) {
    const shiftTime = overrideShiftTime || user.payment?.shift?.time;

    if (!shiftTime) {
      this.seatChangeError = 'Shift time not found for this student, cannot check seat availability';
      this.seatStatusList = [];
      return;
    }

    const currentSeats: number[] = user.payment?.seats || [];
    const isOriginalTime = shiftTime === (user.payment?.shift?.time || null);
    this.seatStatusLoading = true;

    this.http.get<any>(`${this.api}/api/payments/seats/status`, {
      params: { shift: shiftTime }
    }).subscribe({
      next: (res) => {
        const seats = res.seats || [];
        this.seatStatusList = seats
          .filter((s: any) => s.seatNo <= 68)   // only 68 seats actually exist
          .map((s: any) => {
            let status: 'available' | 'booked' | 'current' = 'available';
            if (isOriginalTime && currentSeats.includes(s.seatNo)) {
              status = 'current';        // this student's own seat, at their original time
            } else if (s.status === 'booked') {
              status = 'booked';         // taken (by someone else) for this time slot
            }
            return { seatNo: s.seatNo, status };
          });
        this.seatStatusLoading = false;

        // if a new time slot was picked and the previously selected seat is no
        // longer available there, clear it so admin has to re-pick
        if (this.selectedSeats.length) {
          const stillOk = this.seatStatusList.find(
            s => s.seatNo === this.selectedSeats[0] && s.status !== 'booked'
          );
          if (!stillOk) {
            this.selectedSeats = [];
            this.seatChangeError = 'Previously selected seat is not available at this time. Please pick another seat.';
          }
        }
      },
      error: () => {
        this.seatChangeError = 'Failed to load seat availability';
        this.seatStatusLoading = false;
      }
    });
  }

  toggleSeat(seat: { seatNo: number; status: string }) {
    if (seat.status === 'booked') return; // not selectable, taken by someone else

    // single-select only: clicking the already-selected seat deselects it,
    // clicking any other seat replaces the current selection
    if (this.selectedSeats.length === 1 && this.selectedSeats[0] === seat.seatNo) {
      this.selectedSeats = [];
      this.timeOptions = [];
      this.timeChangePossible = false;
    } else {
      this.selectedSeats = [seat.seatNo];
      // whether time can be changed depends on which seat is picked, so recheck
      this.loadTimeOptionsForSeat(seat.seatNo);
    }
  }

  isSelected(seatNo: number): boolean {
    return this.selectedSeats.includes(seatNo);
  }

  confirmSeatChange() {
    this.seatChangeError = '';

    if (!this.selectedSeats.length) {
      this.seatChangeError = 'Please select at least one seat';
      return;
    }

    this.seatChangeLoading = true;

    this.http.put<any>(`${this.api}/api/payments/change-seat`, {
      userId: this.selectedUser.userId,
      newSeats: this.selectedSeats,
      shiftLabel: this.selectedShiftLabel,
      shiftTime: this.selectedShiftTime
    }).subscribe({
      next: (res) => {
        this.seatChangeLoading = false;
        // update UI instantly, same object reference as in this.users list
        if (this.selectedUser.payment) {
          this.selectedUser.payment.seats = [...this.selectedSeats];
          this.selectedUser.payment.shift = {
            label: this.selectedShiftLabel,
            time: this.selectedShiftTime
          };
        }
        this.notifiaction.success('Success', 'Seat changed successfully');
        this.showSeatModal = false;
      },
      error: (err) => {
        this.seatChangeLoading = false;
        const msg = err?.error?.message || 'Failed to change seat';
        this.seatChangeError = msg;
        this.notifiaction.error('Error', msg);
        // someone else may have just taken a seat - refresh the grid
        this.loadSeatAvailability(this.selectedUser);
      }
    });
  }

  confirmStatusChange() {
    this.loading = true
    const newStatus = !this.selectedUser.payment.isActive;

    this.http.put<any>(`${this.api}/api/payments/update-status`, {
      phoneNumber: this.selectedUser.phoneNumber,
      isActive: newStatus
    }).subscribe(() => {

      // Update UI instantly
      this.selectedUser.payment.isActive = newStatus;
      if (!newStatus) {
        this.selectedUser.payment.seats = [];
        this.selectedUser.payment.shift = { label: null, time: null };
        if (this.selectedUser.payment.plan) {
          this.selectedUser.payment.plan.hours = null;
        }
        this.notifiaction.success('Success', 'User deactivated successfully — seat, time & duration cleared, plan marked expired');
      } else {
        this.notifiaction.success('Success', 'User activated successfully. Student needs to renew their plan to get a seat.');
      }
      this.loading = false
      this.showStatusModal = false;
    });
  }

  viewUser(data: any) {
    this.loading = true;

    const userDetails$ = this.http.get<any>(`${this.api}/api/auth/all-users`, {
      params: { userId: data.userId }
    });

    const userPayments$ = this.http.get<any>(`${this.api}/api/payments/user/${data.userId}`);

    forkJoin([userDetails$, userPayments$]).subscribe({
      next: ([profileRes, paymentsRes]) => {
        const combined = {
          ...data,
          profile: profileRes?.data?.[0] || null,
          payments: paymentsRes?.data || []
        };

        sessionStorage.setItem("studentDATA", JSON.stringify(combined));
        this.loading = false;
        this.router.navigate(['/home/single-student-detail']);
      },
      error: (err) => {
        this.loading = false;
        console.error('viewUser error:', err);
        this.notifiaction.error('Error', 'Failed to load student details');
      }
    });
  }

}
