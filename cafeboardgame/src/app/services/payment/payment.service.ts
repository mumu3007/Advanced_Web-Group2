import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private Url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createPayment(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.Url}/payment/upload`, formData);
  }
}


