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
    return this.http.get(`${this.apiUrl}/boardgame/all`,{withCredentials: true}) ;
  }
  get3Boardgame(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/boardgame3`,{withCredentials: true});
  }
  getinactiveboardgame(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/inactive`,{withCredentials: true});
  }

  // ---------for adminBoardgame-----------//
  getAllBoardgames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/allboardgame`,{withCredentials: true}) ;
  }

  addBoardgame(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/boardgame/boardgame`, formData,{withCredentials: true});
  }

  getBoardgameType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgametype/all`,{withCredentials: true}) ;
  }

  deletedBoardgame(id : number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boardgame/${id}`, { withCredentials: true });
  }

}
