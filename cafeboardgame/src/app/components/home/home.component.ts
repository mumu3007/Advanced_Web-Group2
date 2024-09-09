import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  currentIndex = 1; // ค่าเริ่มต้นให้การ์ดแรกอยู่ตรงกลาง
  isTransitioning = false;

  // ข้อมูลการ์ด
  menuItems = [
    { name: 'GREENTRE MATCHA', price: 69, image: '../../../assets/image1.png' },
    { name: 'STRAWBERRY MATCHA', price: 69, image: '../../../assets/image2.png' },
    { name: 'Yellow MATCHA', price: 69, image: '../../../assets/image3.png' }
  ];

  
  // ฟังก์ชันเลื่อนไปการ์ดถัดไป
  nextSlide() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.menuItems.push(this.menuItems.shift()!);  // เลื่อนไปทางขวา
        this.isTransitioning = false;
      }, 500);  // หน่วงเวลาให้การเคลื่อนที่เสร็จสมบูรณ์ก่อนที่จะเปลี่ยนตำแหน่งจริง
    }
  }

  // ฟังก์ชันเลื่อนไปการ์ดก่อนหน้า
  prevSlide() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.menuItems.unshift(this.menuItems.pop()!);  // เลื่อนไปทางซ้าย
        this.isTransitioning = false;
      }, 500);  // หน่วงเวลาให้การเคลื่อนที่เสร็จสมบูรณ์ก่อนที่จะเปลี่ยนตำแหน่งจริง
    }
  }

  getTransform(index: number): string {
    const offset = index - this.currentIndex;
    return `translateX(${offset * 20}px)`;  // คำนวณการเลื่อนของการ์ดตามแนวนอน
  }
}