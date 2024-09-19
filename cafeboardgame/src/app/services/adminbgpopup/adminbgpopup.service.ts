import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminbgpopupService {
  private apiUrl = 'http://localhost:3000'; // URL ของ API

  constructor(private http: HttpClient) { }

  getBoardgameByID(boardgameId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/boardgame/${boardgameId}`);
  }


}
