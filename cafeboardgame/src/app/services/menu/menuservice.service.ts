import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CakeMenu } from '../../models/cakemenu.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'; // URL ของ backend API

  constructor(private http: HttpClient) { }

  // ฟังก์ชันเพื่อเรียก GET API
  getMenuItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/coffeemenu`, { withCredentials: true });
  }

  getCakeItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/cakemenu`, { withCredentials: true });
  }

  getRecommendedItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/recommended_coffee`, { withCredentials: true });
  }


  addMenuItem(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/menu/coffeemenu`, data, { withCredentials: true });
  }

  addCakeItem(data: CakeMenu): Observable<any> {
    return this.http.post(`${this.apiUrl}/menu/cakemenu`, data, { withCredentials: true });
  }
}
