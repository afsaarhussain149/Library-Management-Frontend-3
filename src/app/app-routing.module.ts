import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './home/login-page/login-page.component';
import { RegisterComponent } from './register/register.component';
import { UnpaidUserComponent } from './unpaid-user/unpaid-user.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomeModule) // Lazy-load HomeModule
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'unpaiduser', component: UnpaidUserComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: 'home' } // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
