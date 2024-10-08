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
    return this.http.get(`${this.apiUrl}/menu/coffeemenu/${coffeemenuId}`,{withCredentials: true});
  }
  
  getCakeByID(cakeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/cakemenu/${cakeId}`,{withCredentials: true});
  }

  updateCoffeemenu(coffeemenuId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/menu/coffeemenu/${coffeemenuId}`, formData,{withCredentials: true});
  }

  updateCakemenu(cakeId: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/menu/cakemenu/${cakeId}`, formData,{withCredentials: true});
  }

}
