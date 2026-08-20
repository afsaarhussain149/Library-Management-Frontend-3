
import { Component, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-header',
  standalone: false,
  templateUrl: './student-header.component.html',
  styleUrl: './student-header.component.css'
})
export class StudentHeaderComponent implements OnInit {
  isMenuOpen = false;
  isNavbarHidden = false;
  isLoggedIn = false;
  private lastScrollTop = 0;
  readonly RENEWAL_WINDOW_DAYS = 5;
  daysUntilExpiry: number | null = null;
  canRenew = false;

  api: string = 'https://library-management-backend-3-62tq.onrender.com';

  // -------------------- RENEW PLAN --------------------
  hasPlan = false;          // student has at least one paid plan ever
  planEndDate: string | null = null;
  isPlanExpired = false;

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !event.url.includes('/login');
      }
    });
  }

  @Output() openComplaint = new EventEmitter<void>();
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.loadPlanStatus();
  }

  loadPlanStatus() {
    const raw = sessionStorage.getItem('userdata');
    if (!raw) return;

    const userdata = JSON.parse(raw);
    if (!userdata?.userId) return;

    this.http.get<any>(`${this.api}/api/payments/user/${userdata.userId}`).subscribe({
      next: (res) => {
        const payments = res?.data || [];
        // list is already ordered by created_at desc from backend,
        // so the first 'paid' record is the student's latest plan
        const latestPaid = payments.find((p: any) => p.status === 'paid');

        if (!latestPaid || !latestPaid.endPlanDate) {
          this.hasPlan = false;
          return;
        }

        this.hasPlan = true;
        this.planEndDate = latestPaid.endPlanDate;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(latestPaid.endPlanDate);
        end.setHours(0, 0, 0, 0);

        const msPerDay = 24 * 60 * 60 * 1000;
        this.daysUntilExpiry = Math.round((end.getTime() - today.getTime()) / msPerDay);

        this.isPlanExpired = this.daysUntilExpiry <= 0;
        this.canRenew = this.daysUntilExpiry <= this.RENEWAL_WINDOW_DAYS;
      },
      error: () => {
        this.hasPlan = false;
      }
    });
  }

  renewPlan() {
    if (!this.canRenew) return;

    const raw = sessionStorage.getItem('userdata');
    if (!raw) return;
    const userdata = JSON.parse(raw);

    // seat-booking-wizard's "User Details" step reads this key to know
    // which userId to attach the new payment to
    sessionStorage.setItem('takeuserdetails', JSON.stringify({
      userId: userdata.userId,
      fullName: userdata.fullName,
      phoneNumber: userdata.personalNumber
    }));

    // full existing profile - wizard prefills the registration form
    // from this instead of asking the student to type everything again
    sessionStorage.setItem('renew_user_profile', JSON.stringify(userdata));

    this.router.navigate(['/home/seat-booking']);
  }
}