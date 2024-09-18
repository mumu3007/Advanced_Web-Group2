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
    { name: 'LATTE CROISSANT', price: 150, image: '../../../assets/loginImage_bg1.png' },
    { name: 'STRAWBERRY MATCHA', price: 80, image: '../../../assets/Remove-bg.ai_1725442470506 1.png' },
    { name: 'PEPSI', price: 20, image: '../../../assets/pepsi__products@2x.png' }
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