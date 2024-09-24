import { Component, OnInit} from '@angular/core';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  currentIndex = 1; // ค่าเริ่มต้นให้การ์ดแรกอยู่ตรงกลาง
  isTransitioning = false;
  boardgameItems: any[] = [];

  constructor (private boardgameservice : BoardgameserviceService) {}
  ngOnInit(): void {
    this.loadMenuItems
    console.log(this.boardgameItems)
  }
  // ข้อมูลการ์ด
  menuItems = [
    { name: 'Cookies\'n Cream Shake', price: 60, image: 'http://localhost:3000/uploads/1727024977368-Cookies and Cream Shake.png' },
    { name: 'Yujahibi', price: 50, image: 'http://localhost:3000/uploads/1727203793050-Yujahibi.png' },
    { name: 'Strawberry Yogurt Smoothie', price: 80, image: 'http://localhost:3000/uploads/1727025187438-Strawberry Yogurt Smoothie.png' }
  ];

  loadMenuItems() {
    this.boardgameservice.getBoardgame().subscribe(
      (data) => {
        this.boardgameItems = data;
        console.log(this.boardgameItems)
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }
  // ฟังก์ชันเลื่อนไปการ์ดถัดไป
  nextSlide() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.menuItems.push(this.menuItems.shift()!);  // เลื่อนไปทางขวา
        this.isTransitioning = false;
      }, 1000);  // หน่วงเวลาให้การเคลื่อนที่เสร็จสมบูรณ์ก่อนที่จะเปลี่ยนตำแหน่งจริง
    }
  }

  // ฟังก์ชันเลื่อนไปการ์ดก่อนหน้า
  prevSlide() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.menuItems.unshift(this.menuItems.pop()!);  // เลื่อนไปทางซ้าย
        this.isTransitioning = false;
      }, 1000);  // หน่วงเวลาให้การเคลื่อนที่เสร็จสมบูรณ์ก่อนที่จะเปลี่ยนตำแหน่งจริง
    }
  }

  getTransform(index: number): string {
    const offset = index - this.currentIndex;
    return `translateX(${offset * 20}px)`;  // คำนวณการเลื่อนของการ์ดตามแนวนอน
  }
}