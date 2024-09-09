import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private Url = `${environment.apiUrl}`;
  private userIdSubject = new BehaviorSubject<string | null>(null); // BehaviorSubject เพื่อเก็บ userId
 


  constructor(private http: HttpClient) {}

    // ฟังก์ชันสำหรับดึง userId
    getUserId(): Observable<string | null> {
      return this.userIdSubject.asObservable();
    }

    getUserById(id: string): Observable<any> {
      return this.http.get(`${this.Url}/user/${id}`,{withCredentials: true}).pipe(
        tap((response: any) => {
          console.log('User data:', response); // ดีบักข้อมูลผู้ใช้ที่ได้รับจาก backend
        }),
        catchError((error) => {
          console.error('Error retrieving user by ID:', error);
          return of(null); // คืนค่า null หากเกิดข้อผิดพลาด
        })
      );
    }



    login(user: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.Url}/auth/login`, user, {
        withCredentials: true,
      }).pipe(
        tap((response: any) => {
          // สมมติว่า response มี userId อยู่ในข้อมูลที่ตอบกลับ
          this.userIdSubject.next(response.userId); // เก็บ userId ใน BehaviorSubject
        })
      );
    }

  logout() {
    return this.http.post(
      `${this.Url}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }


  isAuthenticated(): Observable<boolean> {
    return this.http.get<any>(`${this.Url}/auth/protected`, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.userId) {
          this.userIdSubject.next(response.userId); // อัปเดต userId เมื่อผู้ใช้รับรอง
        }
      }),
      map((response) => !!response.userId),
      catchError((error) => {
        this.userIdSubject.next(null);
        return of(false);
      })
    );
  }

}
