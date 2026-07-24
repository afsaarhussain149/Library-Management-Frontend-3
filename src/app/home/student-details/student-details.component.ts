import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NotificationsService, Options, } from 'angular2-notifications';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    inactive: false
  };

  applyFilter() {
    this.page = 1; // reset pagination
    this.loadPage(this.page);
  }

  formatToMMDDYYYY(dateStr: string): string {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // MUST be yyyy-MM-dd
  }
  clearFilter() {
    this.filters = {
      userId: null,
      fullName: '',
      phone: '',
      active: false,
      inactive: false
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

    if (this.filters.active && !this.filters.inactive) {
      params = params.set('status', 'active');
    }
    else if (!this.filters.active && this.filters.inactive) {
      params = params.set('status', 'inactive');
    }

    // 🔥 Call API (without pagination)
    this.http.get<any>(`${this.api}/api/payments/users-with-payments-all`, { params })
      .subscribe(res => {

        // Backend /api/payments/users-with-payments-all response me sirf
        // userId, fullName, phoneNumber, email, paymentId, paymentStatus,
        // paymentIsActive, paymentCreatedAt hi milte hain — planType/Amount
        // is query me select nahi hote (backend query me add karwana hoga).
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

    // 🔥 Active / Inactive Logic
    if (this.filters.active && !this.filters.inactive) {
      params = params.set('status', 'active');
    }
    else if (!this.filters.active && this.filters.inactive) {
      params = params.set('status', 'inactive');
    }
    // If both selected OR none selected → don't send status (show all)

    this.http
      .get<any>(
        `${this.api}/api/payments/users-with-payments/${page}`,
        { params }
      )
      .subscribe(
        res => {
          // Backend /api/payments/users-with-payments/{page} flat columns deta
          // hai (paymentId, paymentStatus, paymentIsActive, ...) — template
          // nested `u.payment.xxx` expect karta hai, isliye yahan map karte hain.
          // Note: is query me `amount` aur `photo` columns select hi nahi hote,
          // isliye woh yahan blank/0 hi dikhenge (backend query me add karwa lo
          // agar Amount/Photo column bhi table me chahiye).
          this.users = (res.data || []).map((u: any) => ({
            ...u,
            payment: u.paymentId ? {
              paymentId: u.paymentId,
              status: u.paymentStatus,
              isActive: u.paymentIsActive,
              plan: { hours: u.planHours, type: u.planType },
              // backend "seats" ko comma-separated string me deta hai (e.g. "12,13"), array me convert
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
    console.log(user);

  }

  // -------------------- CHANGE SEAT (Admin) --------------------
  showSeatModal = false;
  seatChangeError: string = '';
  seatChangeLoading = false;
  seatStatusLoading = false;
  seatStatusList: { seatNo: number; status: 'available' | 'booked' | 'current' }[] = [];
  selectedSeats: number[] = [];

  openSeatModal(user: any) {
    this.selectedUser = user;
    this.seatChangeError = '';
    const currentSeats: number[] = user.payment?.seats || [];
    this.selectedSeats = currentSeats.length ? [currentSeats[0]] : [];
    this.seatStatusList = [];
    this.showSeatModal = true;
    this.loadSeatAvailability(user);
  }

  closeSeatModal() {
    this.showSeatModal = false;
    this.seatChangeError = '';
  }

  // Fetches live seat status for this student's shift and marks the
  // student's own current seat(s) separately from seats booked by others.
  loadSeatAvailability(user: any) {
    const shiftTime = user.payment?.shift?.time;

    if (!shiftTime) {
      this.seatChangeError = 'Shift time not found for this student, cannot check seat availability';
      this.seatStatusList = [];
      return;
    }

    const currentSeats: number[] = user.payment?.seats || [];
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
            if (currentSeats.includes(s.seatNo)) {
              status = 'current';        // this student's own seat right now
            } else if (s.status === 'booked') {
              status = 'booked';         // taken by someone else, same/overlapping shift
            }
            return { seatNo: s.seatNo, status };
          });
        this.seatStatusLoading = false;
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
    } else {
      this.selectedSeats = [seat.seatNo];
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
      newSeats: this.selectedSeats
    }).subscribe({
      next: (res) => {
        this.seatChangeLoading = false;
        // update UI instantly, same object reference as in this.users list
        if (this.selectedUser.payment) {
          this.selectedUser.payment.seats = [...this.selectedSeats];
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
    console.log('jwjejwjwjwj');
    this.loading = true
    const newStatus = !this.selectedUser.payment.isActive;
    console.log(newStatus);

    this.http.put(`${this.api}/api/payments/update-status`, {
      phoneNumber: this.selectedUser.phoneNumber,
      isActive: newStatus
    }).subscribe(() => {

      // Update UI instantly
      this.selectedUser.payment.isActive = newStatus;
      if (newStatus) {
        this.notifiaction.success('Success', 'User activated successfully');
      } else {
        this.notifiaction.success('Success', 'User deactivated successfully');
      } this.loading = false
      this.showStatusModal = false;
    });
  }
  viewUser(data: any) {
    sessionStorage.setItem("studentDATA", JSON.stringify(data))
    this.router.navigate(['/home/single-student-detail']);
  }

}
