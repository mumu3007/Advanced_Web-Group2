import { environment } from '../../../environments/enviroment'; // Fix typo here (environment)
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart.model'; 
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = `${environment.apiUrl}/ordercoffee`;

  constructor(private http: HttpClient) { }

  // Create a cart or add items to the cart
  addOrdersItem(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, order);
  }


}
