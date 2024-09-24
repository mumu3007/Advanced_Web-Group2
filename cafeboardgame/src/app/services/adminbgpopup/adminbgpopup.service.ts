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

  // ฟังก์ชันอัปเดตบอร์ดเกมตาม ID โดยรองรับการอัปโหลดรูปภาพ
  // updateBoardgame(boardgameId: string, data: any, file?: File): Observable<any> {
  //   const formData: FormData = new FormData();

  //   // เพิ่มข้อมูลอื่นๆ ลงใน FormData
  //   for (const key in data) {
  //     if (data.hasOwnProperty(key)) {
  //       formData.append(key, data[key]);
  //     }
  //   }

  //   // ถ้ามีรูปภาพใหม่ ให้เพิ่มรูปภาพลงใน FormData
  //   if (file) {
  //     formData.append('photo', file, file.name);
  //   }

  //   // ตั้งค่า HTTP headers
  //   // const headers = new HttpHeaders({
  //   //   // กำหนด headers ตามความต้องการ (เช่น Authorization)
  //   // });

  //   // เรียก PATCH request ไปยัง API เพื่ออัปเดตบอร์ดเกม
  //   return this.http.patch(`${this.apiUrl}/boardgame/${boardgameId}`, formData);
  // }

  updateBoardgame(boardgameId: string, formData: FormData): Observable<any> {
    // เรียก PATCH request ไปยัง API เพื่ออัปเดตบอร์ดเกม
    return this.http.patch(`${this.apiUrl}/boardgame/${boardgameId}`, formData,{withCredentials: true});
  }
}

