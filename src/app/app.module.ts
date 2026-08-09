import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // ✅ Import this

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';
import { UnpaidUserComponent } from './unpaid-user/unpaid-user.component';
import { camelCaseInterceptor } from './shared/interceptors/camel-case.interceptor';
import { SeatDetailsComponent } from './home/seat-details/seat-details.component';
import { ComponentsModule } from "./shared/component";


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    UnpaidUserComponent,
    SeatDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, FormsModule,
    HttpClientModule, BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsModule
  ],
  providers: [provideHttpClient(withInterceptors([camelCaseInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
