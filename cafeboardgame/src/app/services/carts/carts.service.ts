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
    return this.http.post(`${this.apiUrl}/add`, cart,{withCredentials: true});
  }

  // Get cart for a specific user by userId
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`,{withCredentials: true});
  }

  deleteOrdercoffee(orderCoffeeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ordercoffee/${orderCoffeeId}`,{withCredentials: true});
  }

  deleteOrdercake(userId: string, cakeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ordercake/${userId}/${cakeId}`,{withCredentials: true});
  }

  deleteOrderboardgame(userId:string, boardgameId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boardgame/${userId}/${boardgameId}`,{withCredentials: true});
  }

  getBaseUrl(): string {
    return 'http://localhost:3000' // หรือใช้ URL เบสที่คุณต้องการ
  }
}
