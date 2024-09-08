import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private Url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  login(user: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.Url}/auth/login`, user);
  }

  getProtected(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.Url}/auth/protected`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.Url}/register/${userId}`); 
  }
}


