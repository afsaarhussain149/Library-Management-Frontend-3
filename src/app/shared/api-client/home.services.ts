import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class homeService {
  private apiUrl = 'https://api.foujibookgardenlibrary.com';

  constructor(private http: HttpClient) {}

  loginuser(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/auth/login',data);
  }
  updateProfile(id: string, formData: FormData) {
  return this.http.put(
   this.apiUrl+'/api/auth/admin-edit-profile',
    formData
  );
}
    adminloginuser(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/auth/adminlogin',data);
  }
   complaint(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/complaint/add-complaint',data);
  }
  basicdetailsuser(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/auth/register-basic',data);
  }
  basicdetailsusercomplete(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/auth/register-basic',data);
  }

  registeruser(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/auth/register',data);
  }
  saveuserplan(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/api/selection',data);
  }
  showuserplan(id:any): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/api/selection/'+id);
  }
   saveShiftSelection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/shift-selection`, data);
  }
   showseat(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/payments/user/${userId}`);
  }

  getShiftsByUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/shift-selection/${userId}`);
  }

  // -------------------- SEATS --------------------
  saveSeatSelection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/seat-selection`, data);
  }

  getSeatsByUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/seat-selection/user/${userId}`);
  }

  getBookedSeatsByPlan(planId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/seat-selection/plan/${planId}`);
  }
}
