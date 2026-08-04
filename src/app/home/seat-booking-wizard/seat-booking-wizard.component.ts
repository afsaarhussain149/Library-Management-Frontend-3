import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { NotificationsService, Options } from 'angular2-notifications';

import { of } from 'rxjs';
// top of file
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-seat-booking-wizard',
  standalone: false,
  templateUrl: './seat-booking-wizard.component.html',
  styleUrls: ['./seat-booking-wizard.component.css'],
})
export class SeatBookingWizardComponent implements OnInit {
  @Output() fullplandetails = new EventEmitter<any>();
  @Output() planSelected = new EventEmitter<any>();
  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;

  // Wizard Steps
  steps = [
    { title: 'Select Plan', disabled: true },
    { title: 'Select Time Slot', disabled: false },
    { title: 'Seat Selection', disabled: false },
    { title: 'User Details', disabled: false },
    { title: 'Payment', disabled: false },
  ];
  currentStepIndex = 0;
  loading = false;
  fullName: string = '';
  fatherName: string = '';
  preparationFor: string = '';
  dob: string = '';
  bloodGroup: string = '';
  presentAddress: string = '';
  permanentAddress: string = '';
  emailReg: string = '';
  personalNumber: string = '';
  emergencyNumber: string = '';
  regpassword: any
  previewImage: any;
  aadhar: any;
  gender: any;
  newprice: any;
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  // -----------------------
  // PLAN DATA
  // -----------------------
  plans = [
    { hours: 4, selected: false, selectedOption: '', options: [{ name: 'Monthly', price: 500, months: 1 }, { name: 'Quarterly', price: 1440, months: 3 }, { name: 'Half Yearly', price: 2700, months: 6 }, { name: 'Annually', price: 4800, months: 12 }] },
    { hours: 6, selected: false, selectedOption: '', options: [{ name: 'Monthly', price: 650, months: 1 }, { name: 'Quarterly', price: 1860, months: 3 }, { name: 'Half Yearly', price: 3420, months: 6 }, { name: 'Annually', price: 6600, months: 12 }] },
    { hours: 8, selected: false, selectedOption: '', options: [{ name: 'Monthly', price: 800, months: 1 }, { name: 'Quarterly', price: 2340, months: 3 }, { name: 'Half Yearly', price: 4500, months: 6 }, { name: 'Annually', price: 8400, months: 12 }] },
    { hours: 10, selected: false, selectedOption: '', options: [{ name: 'Monthly', price: 1000, months: 1 }, { name: 'Quarterly', price: 2880, months: 3 }, { name: 'Half Yearly', price: 5640, months: 6 }, { name: 'Annually', price: 10800, months: 12 }] },
    { hours: 14, selected: false, selectedOption: '', options: [{ name: 'Monthly', price: 1200, months: 1 }, { name: 'Quarterly', price: 3450, months: 3 }, { name: 'Half Yearly', price: 6600, months: 6 }, { name: 'Annually', price: 12000, months: 12 }] },
  ];

  getDiscountPercent(plan: any, opt: any): number {
    if (opt.months === 1) return 0;

    const monthlyPrice = plan.options.find((o: any) => o.months === 1)?.price;
    const originalPrice = monthlyPrice * opt.months;

    const discount =
      ((originalPrice - opt.price) / originalPrice) * 100;

    return Math.round(discount * 100) / 100; // 2 decimal
  }

  totalAmount = 0;
  selectedPlanData: any;

  // -----------------------, months: 3
  // SHIFT DATA
  // -----------------------
  allShifts = [
    { label: '4 Hrs', times: ['8:00 AM - 12:00 PM', '10:00 AM - 2:00 PM', '12:00 PM - 4:00 PM', '2:00 PM - 6:00 PM', '4:00 PM - 8:00 PM', '6:00 PM - 10:00 PM'], open: false },
    { label: '6 Hrs', times: ['8:00 AM - 2:00 PM', '10:00 AM - 4:00 PM', '12:00 PM - 6:00 PM', '2:00 PM - 8:00 PM', '4:00 PM - 10:00 PM'], open: false },
    { label: '8 Hrs', times: ['8:00 AM - 4:00 PM', '10:00 AM - 6:00 PM', '12:00 PM - 8:00 PM', '2:00 PM - 10:00 PM'], open: false },
    { label: '10 Hrs', times: ['8:00 AM - 6:00 PM', '10:00 AM - 8:00 PM', '12:00 PM - 10:00 PM'], open: false },
    { label: '14 Hrs', times: ['8:00 AM - 10:00 PM'], open: false },
  ];
  shifts = [...this.allShifts];
  selectedShiftTime: string | null = null;
  selectedShiftLabel: string | null = null;

  sessiondata: any;

  // Seats
  selectedSeats: number[] = [];

  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200,
  };

  calculatePlanDates(months: number, baseDate?: Date | null) {
    const startDate = (baseDate && !isNaN(baseDate.getTime())) ? new Date(baseDate) : new Date();
    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + months);

    return {
      planStartDate: startDate.toISOString(),
      planEndDate: endDate.toISOString()
    };
  }

  isPlanSelected = false;
  paymentMode: string = "online"; // default

  backendUrl = 'https://library-management-backend-3-62tq.onrender.com/api/payments';
  submit() {
    // validations
    if (!this.selectedPlanData) { this.notifications.warn('Please select a plan'); return; }
    if (!this.selectedShiftLabel || !this.selectedShiftTime) { this.notifications.warn('Please select a shift'); return; }
    if (!this.selectedSeats || this.selectedSeats.length === 0) { this.notifications.warn('Please select a seat'); return; }

    let userdataid = JSON.parse(sessionStorage.getItem('takeuserdetails') || '');

    let months = 0;
    switch (this.selectedPlanData.type) {
      case 'Monthly': months = 1; break;
      case 'Quarterly': months = 3; break;
      case 'Half Yearly': months = 6; break;
      case 'Annually': months = 12; break;
    }

    this.http.get<any>(`${this.backendUrl}/user/${userdataid.userId}`).subscribe({
      next: (res) => {
        const payments = res?.data || [];
        let baseDate: Date | null = null;

        if (payments.length) {
          const latest = payments.reduce((a: any, b: any) =>
            new Date(a.end_plan_date) > new Date(b.end_plan_date) ? a : b
          );
          if (latest?.end_plan_date) {
            baseDate = new Date(latest.end_plan_date);
          }
        }

        this.buildPayloadAndPay(months, baseDate);
      },
      error: () => {
        this.buildPayloadAndPay(months, null);
      }
    });
  }

private buildPayloadAndPay(months: number, baseDate: Date | null) {
  const { planStartDate, planEndDate } = this.calculatePlanDates(months, baseDate);
  console.log('anchor baseDate:', baseDate, 'planStartDate:', planStartDate, 'planEndDate:', planEndDate);

  if (this.selectedPlanData.type == 'Monthly') {
    this.newprice = ((this.selectedPlanData.amount || 0) + 200) * 100;
  } else {
    this.newprice = ((this.selectedPlanData.amount || 0)) * 100;
  }

  let userdataid = JSON.parse(sessionStorage.getItem('takeuserdetails') || '');

  const payload = {
    amount: this.newprice,
    currency: 'INR',
    userId: userdataid.userId,
    planHours: this.selectedPlanData.hours,
    planType: this.selectedPlanData.type,
    planAmount: this.selectedPlanData.amount,
    shiftLabel: this.selectedShiftLabel,
    shiftTime: this.selectedShiftTime,
    seats: this.selectedSeats,
    metadata: {
      fullName: this.sessiondata?.fullName || '',
      email: this.sessiondata?.email || '',
      planId: this.selectedPlanData?.planId || ''
    },
    endPlanDate: planEndDate
  };

  if (this.paymentMode === 'online') {
    const payloadd = {
      ...payload,
      amount: this.newprice,
      currency: 'INR'
    };
    this.createOrderAndPay(payloadd);
    return;
  }

  if (this.paymentMode === 'cash') {
    const cashPayload = {
      ...payload,
      amount: this.newprice,
      paymentMode: "cash"
    };
    this.cashRequest(cashPayload);
    return;
  }
}
  cashRequest(data: any) {
    this.http.post(`${this.backendUrl}/cash-request`, data)
      .subscribe((res: any) => {
        if (res.success) {
          this.notifications.success("Cash request sent! Wait for admin approval.");
          const formData = new FormData();

          // identifier
          formData.append('phoneNumber', this.personalNumber);

          // profile fields
          formData.append('fullName', this.fullName || '');
          formData.append('fatherName', this.fatherName || '');
          formData.append('preparationFor', this.preparationFor || '');
          formData.append('dob', this.dob || '');
          formData.append('bloodGroup', this.bloodGroup || '');
          formData.append('email', this.emailReg || '');
          formData.append('personalNumber', this.personalNumber || '');
          formData.append('emergencyNumber', this.emergencyNumber || '');
          formData.append('presentAddress', this.presentAddress || '');
          formData.append('permanentAddress', this.permanentAddress || '');
          formData.append('password', this.regpassword || '');
          formData.append('aadh', this.aadhar || '');
          formData.append('gender', this.gender || '');

          if (this.selectedFile) {
            formData.append('photo', this.selectedFile);
          }

          this.loading = true;
          // sessionStorage.setItem("userdata",JSON.stringify(formData))
          this.http.post<any>('https://library-management-backend-3-62tq.onrender.com/api/auth/complete-profile', formData).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notifications.success('Success', 'Profile completed successfully');

              this.route.navigate(['/login'])

            },
            error: (err) => {
              this.loading = false;
              this.notifications.error('Error', err.error?.msg || 'Profile update failed');
            }
          });
        } else {
          this.notifications.error(res.message || "Failed to request cash payment.");
        }
      }, err => {
        this.notifications.error(err?.error?.message || "Server error");
      });
  }

  createOrderAndPay(payload: any) {
    this.loading = true;
    this.http.post<any>(`${this.backendUrl}/create-order`, payload).subscribe({
      next: (orderResp) => {
        this.loading = false;
        console.log('create-order response', orderResp);
        // orderResp must include: id (razorpay order id), amount, currency, key (public)
        this.openRazorpay(orderResp);
      },
      error: (err) => {
        this.loading = false;
        console.error('create-order failed', err);
        this.notifications.error('Order creation failed');
      }
    });
  }

  openRazorpay(order: any) {
    const options = {
      key: order.key,                 // public key from backend
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Library Payment',
      description: `Subscription ${this.selectedPlanData?.hours}h ${this.selectedPlanData?.type}`,
      order_id: order.id,             // razorpay order id
      handler: (response: any) => {
        // response: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        this.verifyPayment(response, order);
      },
      prefill: {
        name: this.sessiondata?.fullName || '',
        email: this.sessiondata?.email || '',
        contact: this.sessiondata?.personalNumber || ''
      },
      theme: { color: '#0d9488' }
    };
    console.log(options);

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (resp: any) => {
      console.error('Payment failed', resp);
      this.notifications.error('Payment failed', resp?.error?.description || 'Transaction failed');
    });
    rzp.open();
  }

  verifyPayment(response: any, order: any) {
    // Backend VerifyPaymentRequest bean camelCase fields expect karta hai
    // (razorpayOrderId, razorpayPaymentId, razorpaySignature).
    const payload = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      paymentId: order.paymentId // create-order response se aaya payment_id
    };

    this.loading = true;
    this.http.post<any>(`${this.backendUrl}/verify`, payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.success) {
          this.notifications.success('Payment verified', 'Payment successful and saved.');
          // optional: mark seats booked locally / navigate to success page
          debugger
          const formData = new FormData();

          // identifier
          formData.append('phoneNumber', this.personalNumber);

          // profile fields
          formData.append('fullName', this.fullName || '');
          formData.append('fatherName', this.fatherName || '');
          formData.append('preparationFor', this.preparationFor || '');
          formData.append('dob', this.dob || '');
          formData.append('bloodGroup', this.bloodGroup || '');
          formData.append('email', this.emailReg || '');
          formData.append('personalNumber', this.personalNumber || '');
          formData.append('emergencyNumber', this.emergencyNumber || '');
          formData.append('presentAddress', this.presentAddress || '');
          formData.append('permanentAddress', this.permanentAddress || '');
          formData.append('password', this.regpassword || '');
          formData.append('aadh', this.aadhar || '');
          formData.append('gender', this.gender || '');

          if (this.selectedFile) {
            formData.append('photo', this.selectedFile);
          }

          this.loading = true;
          // sessionStorage.setItem("userdata",JSON.stringify(formData))
          this.http.post<any>('https://library-management-backend-3-62tq.onrender.com/api/auth/complete-profile', formData).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notifications.success('Success', 'Profile completed successfully');

              this.route.navigate(['/login'])

            },
            error: (err) => {
              this.loading = false;
              this.notifications.error('Error', err.error?.msg || 'Profile update failed');
            }
          });
          // this.route.navigate(['/login'])
          console.log('verify response', res);
        } else {
          this.notifications.error('Verification failed', res?.message || 'Could not verify payment.');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('verify error', err);
        this.notifications.error('Verification failed');
      }
    });
  }
  // NOTE: homeService removed — no external API calls
  constructor(private notifications: NotificationsService, private http: HttpClient, private route: Router, private cdr: ChangeDetectorRef // add this
  ) { }

  ngOnInit(): void {
    // this.sessiondata = JSON.parse(sessionStorage.getItem('userdata') || '{}');
    // If you want previously saved wizard state, you can load it here:
    // const saved = sessionStorage.getItem('wizard_state');
    // if (saved) {
    //   try { Object.assign(this, JSON.parse(saved)); } catch { /* ignore parse errors */ }
    // }
    sessionStorage.removeItem('saved_plan');
    sessionStorage.removeItem('saved_shift');
    sessionStorage.removeItem('saved_seat');
    sessionStorage.removeItem('wizard_state');

    // User session (keep this)
    this.sessiondata = JSON.parse(sessionStorage.getItem('userdata') || '{}');

    const renewProfileRaw = sessionStorage.getItem('renew_user_profile');
    if (renewProfileRaw) {
      const p = JSON.parse(renewProfileRaw);
      this.fullName = p.fullName || '';
      this.fatherName = p.fatherName || '';
      this.preparationFor = p.preparationFor || '';
      this.dob = p.dob ? p.dob.substring(0, 10) : '';
      this.bloodGroup = p.bloodGroup || '';
      this.emailReg = p.email || '';
      this.personalNumber = p.personalNumber || '';
      this.emergencyNumber = p.emergencyNumber || '';
      this.presentAddress = p.presentAddress || '';
      this.permanentAddress = p.permanentAddress || '';
      this.aadhar = p.aadh || '';
      this.gender = p.gender || '';
      // password intentionally left blank - student re-enters it for security
    }

    // 🔄 2. Reset all wizard variables
    this.currentStepIndex = 0;
    this.selectedPlanData = null;
    this.selectedShiftLabel = null;
    this.selectedShiftTime = null;
    this.selectedSeats = [];
    this.totalAmount = 0;
    this.isPlanSelected = false;

    // Reset plans state
    this.plans.forEach(p => {
      p.selected = false;
      p.selectedOption = '';
    });

    // Reset shifts
    this.shifts = [...this.allShifts];
    this.shifts.forEach(s => s.open = false);

    console.log("Wizard reset successfully on page load!");
  }

  // -----------------------
  // PLAN SELECTION
  // -----------------------
  tick: any
  onPlanSelect(selectedPlan: any) {
    // unselect others and clear their selectedOption
    this.plans.forEach(p => {
      if (p !== selectedPlan) {
        p.selected = false;
        p.selectedOption = '';
      }
    });

    if (!selectedPlan.selected) {
      this.selectedPlanData = null;
      this.totalAmount = 0;
      this.selectedShiftLabel = null;
      this.selectedShiftTime = null;
      this.selectedSeats = [];
      this.isPlanSelected = false;
      this.planSelected.emit(null);
      return;
    }

    this.selectedPlanData = null;
    this.totalAmount = 0;
    this.selectedShiftLabel = null;
    this.selectedShiftTime = null;
    this.selectedSeats = [];
    this.isPlanSelected = false;

    selectedPlan.selectedOption = '';

    // Update shifts to ones corresponding to the newly selected hours (will show on step 2)
    this.shifts = this.allShifts.filter(s => s.label === `${selectedPlan.hours} Hrs`);

    // Emit null so parent knows nothing finalized yet
    this.planSelected.emit(null);

    // optional: give user a notification
    this.notifications.info('Plan changed', `Please pick an option for ${selectedPlan.hours} Hrs plan.`);
  }


  selectOption(plan: any, opt: any) {
    plan.selectedOption = opt.name;
    this.totalAmount = opt.price;

    this.selectedPlanData = {
      hours: plan.hours,
      type: opt.name,
      amount: opt.price
    };

    this.isPlanSelected = true;
    this.planSelected.emit(this.selectedPlanData);

    // Update shifts based on selected hours
    this.shifts = this.allShifts.filter(s => s.label === `${plan.hours} Hrs`);

    this.notifications.success('Plan Selected', `${opt.name} - ${plan.hours} Hrs for ₹${opt.price}`);
  }
  completeProfile() {
    if (!this.personalNumber) {
      this.notifications.error('Error', 'Phone number is required');
      return;
    }

    const formData = new FormData();

    // ✅ Mandatory identifier
    formData.append('phoneNumber', this.personalNumber);

    // ✅ Profile fields
    formData.append('fullName', this.fullName || '');
    formData.append('fatherName', this.fatherName || '');
    formData.append('preparationFor', this.preparationFor || '');
    formData.append('dob', this.dob || '');
    formData.append('bloodGroup', this.bloodGroup || '');
    formData.append('email', this.emailReg || '');
    formData.append('personalNumber', this.personalNumber || '');
    formData.append('emergencyNumber', this.emergencyNumber || '');
    formData.append('presentAddress', this.presentAddress || '');
    formData.append('permanentAddress', this.permanentAddress || '');
    formData.append('password', this.regpassword || '');

    // ✅ Image (ONLY if selected)
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.loading = true;

    this.http.post<any>('https://library-management-backend-3-62tq.onrender.com/api/auth/complete-profile', formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notifications.success('Success', 'Profile saved successfully');
        console.log('Response:', res);
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.msg || 'Something went wrong');
        console.error(err);
      }
    });
  }
  uploadType: 'file' | 'camera' | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  stream: MediaStream | null = null;

  @ViewChild('video') video?: ElementRef<HTMLVideoElement>;

  isCameraVisible = false;

  // FILE UPLOAD
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  // START CAMERA
  async startCamera() {
    this.isCameraVisible = true;

    setTimeout(async () => {
      if (!this.video) return;

      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement;

      videoEl.srcObject = this.stream;
      videoEl.onloadedmetadata = () => videoEl.play();
    });
  }



  // CAPTURE IMAGE
  capture() {
    const videoEl = this.video?.nativeElement;
    if (!videoEl || videoEl.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      this.selectedFile = new File([blob], 'camera-photo.png', {
        type: 'image/png'
      });

      this.imagePreview = URL.createObjectURL(blob);

      // ✅ CRITICAL LINES
      this.isCameraVisible = false;
      this.stopCamera();
      this.cdr.detectChanges(); // 🔥 FORCE UI UPDATE

      console.log('CAPTURED', this.imagePreview);
    }, 'image/png');
  }




  // STOP CAMERA
  stopCamera() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
  }

  // DELETE IMAGE
  deleteImage() {
    this.resetAll();
  }

  // RESET ALL
  resetAll() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.isCameraVisible = false;
    this.stopCamera();

    if (this.uploadType === 'camera') {
      setTimeout(() => this.startCamera(), 100);
    }
  }


  // APPEND FILE (API READY)


  // Scroll Buttons
  scrollLeft() {
    this.cardContainer.nativeElement.scrollBy({ left: -400, behavior: 'smooth' });
  }
  scrollRight() {
    this.cardContainer.nativeElement.scrollBy({ left: 400, behavior: 'smooth' });
  }

  // -----------------------
  // SHIFT SELECTION
  // -----------------------
  toggleShift(shift: any) {
    shift.open = !shift.open;
  }
  selectTime(label: string, time: string) {
    this.selectedShiftLabel = label;
    this.selectedShiftTime = time;
    this.notifications.success('Shift Selected', `${label} (${time})`);
  }

  // -----------------------
  // WIZARD NAVIGATION (no APIs; saves locally)
  // -----------------------
  previous() {
    if (this.currentStepIndex > 0) this.currentStepIndex--;
  }

  next() {
    // STEP 1 → SAVE PLAN (locally)
    if (this.currentStepIndex === 0) {
      if (!this.isPlanSelected) {
        this.notifications.warn('Warning', 'Please select a plan before continuing.');
        return;
      }

      this.loading = true;
      const payload = {
        userId: this.sessiondata.userId,
        fullName: this.sessiondata.fullName,
        email: this.sessiondata.email,
        selectedPlan: { ...this.selectedPlanData }
      };

      // emulate an observable save (no API) and subscribe immediately
      of(payload).subscribe(res => {
        this.loading = false;
        // save locally to sessionStorage
        sessionStorage.setItem('saved_plan', JSON.stringify(res));
        // also save a wizard snapshot
        this.saveWizardState();
        console.log('Plan saved locally:', res);
        this.notifications.success('Success', 'Plan saved locally!');
        this.currentStepIndex++;
      });

      return;
    }

    // STEP 2 → SAVE SHIFT
    if (this.currentStepIndex === 1) {
      if (!this.selectedShiftTime) {
        this.notifications.warn('Warning', 'Please select a shift time.');
        return;
      }

      const payload = {
        userId: this.sessiondata.userId,
        shiftLabel: this.selectedShiftLabel,
        shiftTime: this.selectedShiftTime,
        plan: this.selectedPlanData
      };

      this.loading = true;
      of(payload).subscribe(res => {
        this.loading = false;
        sessionStorage.setItem('saved_shift', JSON.stringify(res));
        this.saveWizardState();
        console.log('Shift saved locally:', res);
        this.notifications.success('Success', 'Shift saved locally.');
        this.currentStepIndex++;
      });

      return;
    }

    // STEP 3 → SAVE SEAT
    if (this.currentStepIndex === 2) {
      if (this.selectedSeats.length === 0) {
        this.notifications.warn('Warning', 'Please select a seat.');
        return;
      }

      const payload = {
        userId: this.sessiondata.userId,
        seatNo: this.selectedSeats[0],
        shiftLabel: this.selectedShiftLabel,
        shiftTime: this.selectedShiftTime,
        plan: this.selectedPlanData
      };

      this.fullplandetails.emit(payload);
      this.loading = true;

      of(payload).subscribe({
        next: (res) => {
          this.loading = false;
          sessionStorage.setItem('saved_seat', JSON.stringify(res));
          this.saveWizardState();
          console.log('Seat saved locally:', res);
          this.notifications.success('Success', 'Seat saved locally.');
        },
        error: (err) => {
          this.loading = false;
          this.notifications.error('Error', 'Failed to save seat locally.');
        }
      });

      this.currentStepIndex++;
      let basicuserdata = JSON.parse(sessionStorage.getItem('takeuserdetails') || '')
      this.fullName = basicuserdata.fullName
      this.personalNumber = basicuserdata.phoneNumber
      console.log(this.fullName, "ff", this.personalNumber);
      return;
    }
    if (this.currentStepIndex === 3) {

      console.log(this.selectedFile);

      // basic validation
      if (!this.personalNumber) {
        this.notifications.error('Error', 'Phone number is required');
        return;
      }
      if (!this.validateCompleteProfile()) {
        return; // stop if any field missing
      }

      const formData = new FormData();

      // identifier
      formData.append('phoneNumber', this.personalNumber);

      // profile fields
      formData.append('fullName', this.fullName || '');
      formData.append('fatherName', this.fatherName || '');
      formData.append('preparationFor', this.preparationFor || '');
      formData.append('dob', this.dob || '');
      formData.append('bloodGroup', this.bloodGroup || '');
      formData.append('email', this.emailReg || '');
      formData.append('personalNumber', this.personalNumber || '');
      formData.append('emergencyNumber', this.emergencyNumber || '');
      formData.append('presentAddress', this.presentAddress || '');
      formData.append('permanentAddress', this.permanentAddress || '');
      formData.append('password', this.regpassword || '');

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      // this.loading = true;
      // // sessionStorage.setItem("userdata",JSON.stringify(formData))
      // this.http.post<any>('https://library-management-backend-3-62tq.onrender.com/api/auth/complete-profile', formData).subscribe({
      //   next: (res: any) => {
      //     this.loading = false;
      //     sessionStorage.setItem('completed_profile', JSON.stringify(res.user));
      //     this.notifications.success('Success', 'Profile completed successfully');
      //   },
      //   error: (err) => {
      //     this.loading = false;
      //     this.notifications.error('Error', err.error?.msg || 'Profile update failed');
      //   }
      // });
      this.currentStepIndex++; // ✅ move to final step

      return;
    } if (this.currentStepIndex)
      // NEXT STEP (generic)
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
      }
  }

  // Local wizard snapshot (optional)
  saveWizardState() {
    const state = {
      currentStepIndex: this.currentStepIndex,
      plans: this.plans,
      selectedPlanData: this.selectedPlanData,
      shifts: this.shifts,
      selectedShiftLabel: this.selectedShiftLabel,
      selectedShiftTime: this.selectedShiftTime,
      selectedSeats: this.selectedSeats
    };
    sessionStorage.setItem('wizard_state', JSON.stringify(state));
  }
  private validateCompleteProfile(): boolean {

    if (!this.fullName?.trim()) {
      this.notifications.error('Error', 'Full Name is required');
      return false;
    }

    if (!this.personalNumber?.trim()) {
      this.notifications.error('Error', 'Phone Number is required');
      return false;
    }

    if (this.personalNumber.length !== 10) {
      this.notifications.error('Error', 'Phone Number must be 10 digits');
      return false;
    }

    if (!this.fatherName?.trim()) {
      this.notifications.error('Error', 'Father Name is required');
      return false;
    }

    if (!this.dob) {
      this.notifications.error('Error', 'Date of Birth is required');
      return false;
    }

    if (!this.preparationFor?.trim()) {
      this.notifications.error('Error', 'Preparation For field is required');
      return false;
    }

    if (!this.personalNumber?.trim()) {
      this.notifications.error('Error', 'Personal Number is required');
      return false;
    }

    if (this.personalNumber.length !== 10) {
      this.notifications.error('Error', 'Personal Number must be 10 digits');
      return false;
    }

    if (!this.emergencyNumber?.trim()) {
      this.notifications.error('Error', 'Emergency Number is required');
      return false;
    }

    if (this.emergencyNumber?.length !== 10) {
      this.notifications.error('Error', 'Emergency Number must be 10 digits');
      return false;
    }

    if (!this.presentAddress?.trim()) {
      this.notifications.error('Error', 'Present Address is required');
      return false;
    }

    if (!this.permanentAddress?.trim()) {
      this.notifications.error('Error', 'Permanent Address is required');
      return false;
    }

    if (!this.regpassword?.trim()) {
      this.notifications.error('Error', 'Password is required');
      return false;
    }

    if (this.regpassword.length < 6) {
      this.notifications.error('Error', 'Password must be at least 6 characters');
      return false;
    }

    return true; // ✅ all fields valid
  }

  // Seat Event

  sameAsPresent = false;

  onSameAddressToggle() {
    if (this.sameAsPresent) {
      this.permanentAddress = this.presentAddress;
    } else {
      this.permanentAddress = '';
    }
  }

  onPresentChange() {
    if (this.sameAsPresent) {
      this.permanentAddress = this.presentAddress;
    }
  }

  onSeatsSelected(seats: number[]) {
    this.selectedSeats = seats;
    this.notifications.success('Seat Selected', `${seats}`);
  }

  // Submit: final local submit - logs all saved pieces
  // submit() {
  //   const final = {
  //     plan: JSON.parse(sessionStorage.getItem('saved_plan') || 'null'),
  //     shift: JSON.parse(sessionStorage.getItem('saved_shift') || 'null'),
  //     seat: JSON.parse(sessionStorage.getItem('saved_seat') || 'null')
  //   };
  //   console.log('Final submission (local):', final);
  //   this.notifications.success('Submitted', 'Form data logged to console and stored in sessionStorage.');
  //   alert('Form Submitted Successfully! (check console & sessionStorage)');
  // }

  isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }
}
