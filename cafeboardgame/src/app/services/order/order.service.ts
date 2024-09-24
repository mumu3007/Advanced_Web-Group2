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
  private apiUrl2 = `${environment.apiUrl}/ordercake`;

  constructor(private http: HttpClient) { }

  // Create a cart or add items to the cart
  addOrdersItem(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, order,{withCredentials: true});
  }

  addCakesItem(cakeorder: any): Observable<any> {
    return this.http.post(`${this.apiUrl2}/order`, cakeorder,{withCredentials: true});
  }
}



