import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { homeService } from '../../shared/api-client/home.services';
import { Router } from '@angular/router';   // ✅ ADD THIS
import { HttpClient } from '@angular/common/http';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-home.ts',
  standalone: false,
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css'
})
export class HomeTsComponent implements OnInit, AfterViewInit {
  loading = false;

  constructor(
    private homeServices: homeService,
    private http: HttpClient,
    private router: Router ,
        private notificationsService: NotificationsService,
               // ✅ ADD THIS
  ) { }
name:any
mail:any
message:any
subject:any
  api: any = 'https://library-management-backend-3-62tq.onrender.com';

  mobileMenuOpen = false;
  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
  private triedPlaying = false;

  ngAfterViewInit(): void {
    sessionStorage.clear()
    this.tryPlayVideo();
  }
save(){
  let payload={
  "name": this.name,
  "mail": this.mail,
  "subject": this.subject,
  "message": this.message
}
console.log(payload);
    this.loading = true;

    this.http.post<any>(`${this.api}/api/query`,payload).subscribe({
      next: () => {
        this.notificationsService.success('success','Query submitted successfully!')
        this.loading = false;
        this.mail=''
        this.name=''
        this.subject=''
        this.message=''
      },
      error: () => {
         this.notificationsService.error('Error submitting query');
        this.loading = false;
      }
    });
  
}
notificationOptions: Options = {
    position: ['top', 'right'],   // 👈 always top-right of screen
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
  private tryPlayVideo() {
    const video = this.bgVideo.nativeElement;
    video.muted = true;
    video.play().catch(err => {
      console.warn('Autoplay blocked, waiting for user interaction...', err);
      this.triedPlaying = false;
    });
  }

  @HostListener('document:click')
  @HostListener('document:keydown')
  @HostListener('document:scroll')
  onUserInteraction() {
    if (!this.triedPlaying) {
      this.triedPlaying = true;
      const video = this.bgVideo.nativeElement;
      video.muted = true;
      video.play().catch(err => console.warn('Playback still blocked:', err));
    }
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnInit(): void {
    this.name=''
this.mail=''
this.message=''
this.subject=''
    const payload = {
      "fullName": "John Do88se",
      "email": "john@ex;amp9le.com",
      "password": "12;39456"
    }
  }

  // ✅ ROUTE TO REGISTER PAGE
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
