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

  deleteCoffeeMenu(id : number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/menu/coffeemenu/${id}`, { withCredentials: true });
  }

  deletedCakemenu(id : number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/menu/cakemenu/${id}`, { withCredentials: true });
  }


  addMenuItem(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/menu/coffeemenu`, formData, { withCredentials: true });
  }

  addCakeItem(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/menu/cakemenu`, formData, { withCredentials: true });
  }
}
