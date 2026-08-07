import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { homeService } from '../../shared/api-client/home.services';
import { jsPDF } from 'jspdf';
import { NotificationsService, Options, } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';
import html2pdf from 'html2pdf.js';

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

Router
@Component({
  selector: 'app-user-page',
  standalone: false,
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'

})
export class UserPageComponent implements OnInit, OnDestroy {
  userdata: any
  editProfileData: any = {};
  age: number | undefined;
  seat: any;
  photoUrl: string = '';
  downloadPdf() {
    const element = document.getElementById('id-card-print');
    if (!element) return;

    html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename: 'ID-Card.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth + 50,
          windowHeight: element.scrollHeight + 50
        },
        jsPDF: {
          unit: 'mm',
          format: [500, 500],
          orientation: 'landscape'
        }
      })
      .from(element)
      .save()
      .then(() => {
      })
      .catch(() => {
        this.notifications.error('Error', 'Failed to download ID card. Please try again.');
      });
  }
  notificationOptions: Options = {
    position: ['top', 'right'],
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200,
  };
  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }


  paymentdata: any[] = []
  imageUrl =
    'https://res.cloudinary.com/dijbjxao2/image/upload/v1765298220/students/svu1rr6elembezif4wsp.png';
  async generateCard(userdata: any): Promise<void> {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [54, 85.6]
    });

    const cardW = 85.6;
    const cardH = 54;

    doc.setLineWidth(0.6);
    doc.rect(1, 1, cardW - 2, cardH - 2);

    const left = 4;
    const right = cardW - 4;
    let y = 2;

    const safe = (v: any) => (v ? String(v) : '');

    const logoImg = await this.loadImage('/IDlogo.png');
    const logoW = 35;
    const logoH = (logoImg.height / logoImg.width) * logoW;
    const logoX = (cardW - logoW) / 2;

    doc.addImage(logoImg, 'PNG', logoX, y, logoW, logoH);
    y += logoH + 1;

    const stripH = 5;
    doc.setFillColor(0, 160, 0);
    doc.rect(18, y, cardW - 36, stripH, 'F');

    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('MEMBERSHIP CARD', cardW / 2, y + 3.6, { align: 'center' });

    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    y += stripH + 3;

    const photoW = 14;
    const photoH = 18;
    const photoX = right - photoW;
    const photoY = y;

    doc.setLineWidth(0.4);
    doc.rect(photoX, photoY, photoW, photoH);

    if (userdata.photo) {
      try {
        const userPhoto = await this.loadImage(userdata.photo);
        doc.addImage(userPhoto, 'JPEG', photoX + 1, photoY + 1, photoW - 2, photoH - 2);
      } catch { }
    }

    doc.setFontSize(7);

    const labelX = left;
    const valueX = left + 18;
    const lineEndX = photoX - 2;
    const gap = 4;

    const field = (label: string, value: string) => {
      doc.text(label, labelX, y);
      doc.line(valueX, y + 0.6, lineEndX, y + 0.6);
      doc.text(safe(value), valueX + 1, y);
      y += gap;
    };

    field('Seat:', safe(this.seat));
    field('Name:', userdata.fullName);
    field('Father Name:', userdata.fatherName);

    doc.text('DOB:', labelX, y);
    doc.line(valueX, y + 0.6, valueX + 16, y + 0.6);
    doc.text(this.formatDate(userdata.dob), valueX + 1, y);

    let gx = valueX + 18;
    const gy = y - 3;
    const box = 3;
    const gender = safe(userdata.gender).toUpperCase();

    const drawGender = (key: 'M' | 'F' | 'O', label: string) => {
      doc.rect(gx, gy, box, box);
      if (
        (key === 'M' && gender === 'M') ||
        (key === 'F' && gender === 'F') ||
        (key === 'O' && gender === 'OTHER')
      ) {
        doc.text('✔', gx + 0.4, gy + 2.6);
      }
      doc.text(label, gx + 4, gy + 2.6);
      gx += key === 'O' ? 14 : 10;
    };

    drawGender('M', 'M');
    drawGender('F', 'F');
    drawGender('O', 'O');

    y += gap;

    field('Student Id::', userdata.userId);
    field('Mobile No:', userdata.personalNumber);
    field('Address:', userdata.permanentAddress);

    doc.save('MembershipCard-ActualSize.pdf');
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
    });
  }

  constructor(private Rout: Router, private home: homeService, private notifications: NotificationsService, private http: HttpClient) { }
  ngOnInit(): void {
    this.userdata = JSON.parse(sessionStorage.getItem('userdata') || '')
    this.home.showseat(this.userdata.userId).subscribe((data: any) => {
      this.paymentdata = data.data

      const rawSeats = data.data?.[0]?.seats;
      const seatList = typeof rawSeats === 'string' && rawSeats.length
        ? rawSeats.split(',').map((s: string) => Number(s.trim()))
        : [];
      this.seat = seatList[0];

    })
    this.age = this.calculateAge(this.userdata.dob);
  }
  seatcount: any
  calculateAge(dobString: string): number {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);

    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }
  seatopen() {
    this.Rout.navigate(['/home/seat-booking'])
  }
  issue: any = "Technical Issue"
  message: any
  loading = false;

  complain() {

    let payload = {
      "userId": this.userdata.userId,
      "message": this.message,
      "issueType": this.issue
    }
    this.loading = true;

    this.home.complaint(payload).subscribe({
      next: (data: any) => {
        console.log(data);
        this.showComplaint = false
        this.notifications.success('success', "Complaint Save successful");

        this.loading = false;


      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error.msg);
      }
    })
  }
  ngOnDestroy(): void {
    // sessionStorage.clear();
  }

  showComplaint = false;

  showEditProfile = false;

  form: any = {
    fullName: '',
    fatherName: '',
    gender: '',
    dob: '',
    email: '',
    personalNumber: '',
    emergencyNumber: '',
    preparationFor: '',
    presentAddress: '',
    permanentAddress: '',
    aadh: '',
    password: ''
  };

  selectedImage: File | null = null;

  onImageSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }

  openEditProfile() {
    this.form = {
      fullName: this.userdata.fullName,
      fatherName: this.userdata.fatherName,
      gender: this.userdata.gender,
      dob: this.userdata.dob,
      email: this.userdata.email,
      personalNumber: this.userdata.personalNumber,
      emergencyNumber: this.userdata.emergencyNumber,
      preparationFor: this.userdata.preparationFor,
      presentAddress: this.userdata.presentAddress,
      permanentAddress: this.userdata.permanentAddress,
      aadh: this.userdata.aadh || this.userdata?.aadharNumber,
      photo: this.userdata.photo
    };

    this.showEditProfile = true;
  }

  updateProfile() {
    const formData = new FormData();

    formData.append('userId', this.userdata.userId);
    formData.append('fullName', this.form.fullName);
    formData.append('fatherName', this.form.fatherName);
    formData.append('gender', this.form.gender);
    formData.append('dob', this.form.dob);
    formData.append('email', this.form.email);
    formData.append('personalNumber', this.form.personalNumber);
    formData.append('emergencyNumber', this.form.emergencyNumber);
    formData.append('preparationFor', this.form.preparationFor);
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

    this.http.put('https://library-management-backend-3-62tq.onrender.com/api/auth/user/edit-profile', formData).subscribe({
      next: (res: any) => {
        this.notifications.success('Success', 'Profile updated successfully');
        sessionStorage.clear();
        this.Rout.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notifications.error('Error', err.error?.msg || 'Update failed');
      }
    });
  }

  removePhoto() {
    this.form.photo = null;
  }
}
