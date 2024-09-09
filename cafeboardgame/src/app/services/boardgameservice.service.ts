import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BoardgameserviceService {

  
  private apiUrl = 'http://localhost:3000'; // URL ของ backend API

  constructor(private http: HttpClient) { }

  // ฟังก์ชันเพื่อเรียก GET API
  getBoardgame(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/all`);
  }
  get3Boardgame(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/boardgame3`);
  }
  getinactiveboardgame(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/inactive`);
  }

  // ฟังก์ชันเพื่อเรียก POST API
  addBoardgame(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/boardgame/boardgame`, data);
  }
}
