import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenupopupService {
  private apiUrl = 'http://localhost:3000'; // URL ของ API

  constructor(private http: HttpClient) { }

  getMenuDetails(menuId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/coffeemenu/${menuId}`);
  }

  getCakeDetails(cakeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/cakemenu/${cakeId}`);
  }
}

