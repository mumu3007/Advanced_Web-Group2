import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/menu/menuservice.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuItems: any[] = [];
  displayedItems: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.updateDisplayedItems();
  }

  // ฟังก์ชันเพื่อเรียกเมนูจาก API
  loadMenuItems() {
    this.apiService.getMenuItems().subscribe(
      (data) => {
        this.menuItems = data;
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  // ฟังก์ชันเพื่อเพิ่มเมนูใหม่
  addMenuItem(newItem: any) {
    this.apiService.addMenuItem(newItem).subscribe(
      (response) => {
        console.log('Menu item added:', response);
        this.loadMenuItems(); // โหลดข้อมูลใหม่หลังจากเพิ่มเมนู
      },
      (error) => {
        console.error('Error adding menu item:', error);
      }
    );
  }

  updateDisplayedItems() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedItems = this.menuItems.slice(start, end);
    console.log("refresh complete")
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.menuItems.length) {
      this.currentPage++;
      this.updateDisplayedItems();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedItems();
    }
  }
}
