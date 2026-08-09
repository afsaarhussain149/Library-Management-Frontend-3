import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTsComponent } from './front-page/frontpage.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from "../shared/component";
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PlansComponent } from './plans/plans.component';
import { SeatComponent } from './seat/seat.component';
import { ShiftTimeComponent } from './shift-time/shift-time.component';
import { UserPageComponent } from './user-page/user-page.component';
import { SeatBookingWizardComponent } from './seat-booking-wizard/seat-booking-wizard.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

import { AuthGuard } from '../shared/auth.guard';
import { SeatGuard } from '../shared/seat.guard';
import { FeesRecordsComponent } from './fees-records/fees-records.component';
import { QueryComponent } from './query/query.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { SingleStudentDetailComponent } from './single-student-detail/single-student-detail.component';
import { SeatDetailsComponent } from './seat-details/seat-details.component';
import { FeeRecordsComponent } from './fee-records/fee-records.component';



const routes: Routes = [
  { path: '', component: HomeTsComponent },// Default route for HomeModule
  { path: 'plan', component: PlansComponent, canActivate: [AuthGuard] }, // Default route for HomeModule
  { path: 'seat', component: SeatComponent, canActivate: [AuthGuard] }, // Default route for HomeModule
  { path: 'shift-time', component: ShiftTimeComponent, canActivate: [AuthGuard] }, // Default route for HomeModule
  { path: 'seat-booking', component: SeatBookingWizardComponent, canActivate: [SeatGuard] }, // Default route for HomeModule
  { path: 'user', component: UserPageComponent, canActivate: [AuthGuard] }, // Default route for HomeModule
  { path: 'admin', component: AdminPageComponent, canActivate: [AuthGuard] }, // Default route for HomeModule
  { path: 'fees-records', component: FeesRecordsComponent },
  { path: 'query', component: QueryComponent },
  { path: 'complaint', component: ComplaintComponent },
  { path: 'students-details', component: StudentDetailsComponent },
  { path: 'single-student-detail', component: SingleStudentDetailComponent },
  { path: 'seat-details', component: SeatDetailsComponent },
  { path: 'fee-records', component: FeeRecordsComponent },
];


@NgModule({
  declarations: [
    HomeTsComponent,
    LoginPageComponent,
    PlansComponent,
    SeatComponent,
    ShiftTimeComponent,
    UserPageComponent,
    SeatBookingWizardComponent,
    PaymentComponent,
    AdminPageComponent,
    FeesRecordsComponent,
    QueryComponent,
    ComplaintComponent,
    StudentDetailsComponent,
    SingleStudentDetailComponent,
    FeeRecordsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule, FormsModule, SimpleNotificationsModule.forRoot()

  ]
})
export class HomeModule { }
