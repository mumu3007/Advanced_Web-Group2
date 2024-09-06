import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private Url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }
  register(user: User): Observable<any> {
    return this.http.post(`${this.Url}/register`, user);
  }
}
