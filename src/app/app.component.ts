import { Component, OnInit } from '@angular/core';
import { homeService } from './shared/api-client/home.services';
import { NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'lib-frontend';
  products: any[] = [];
notificationOptions: Options = {
    position: ['top', 'right'],   // 👈 always top-right of screen
    timeOut: 4000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 200
  };
  constructor(private homeServices: homeService,protected notificationsService: NotificationsService,
) {}

  ngOnInit(): void {
    
    // this.homeServices.getProducts().subscribe((data: any) => {
    //   this.products = data;
      
    // });
  }
}
