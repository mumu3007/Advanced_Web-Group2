import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemlistpopupService {
  private apiUrl = 'http://localhost:3000'; // URL ของ API

  constructor(private http: HttpClient) { }

  getCoffeemenuByID(coffeemenuid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/coffeemenu/${coffeemenuid}`);
  }


}
