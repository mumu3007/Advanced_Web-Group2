import { Injectable } from '@angular/core';
import { environment } from '../../../environments/enviroment'; // Fix typo here (environment)
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) { }

  // Create a cart or add items to the cart
  addCartItem(cart: CartItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, cart);
  }

  // Get cart for a specific user by userId
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
}
