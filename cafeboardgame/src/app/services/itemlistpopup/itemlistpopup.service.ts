import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemlistpopupService {
  private apiUrl = 'http://localhost:3000'; // URL ของ API

  constructor(private http: HttpClient) { }

  getCoffeemenuByID(coffeemenuId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/coffeemenu/${coffeemenuId}`);
  }
  
  getCakeByID(cakeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/cakemenu/${cakeId}`);
  }

  updateCoffeemenu(coffeemenuId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/menu/coffeemenu/${coffeemenuId}`, formData);
  }

  updateCakemenu(cakeId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/menu/cakemenu/${cakeId}`, formData);
  }

}
