import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MenupopupService } from '../../services/menupopup.service';

@Component({
  selector: 'app-menu-popup',
  templateUrl: './menupopup.component.html',
  styleUrls: ['./menupopup.component.css']
})
export class MenupopupComponent implements OnInit {
  @Input() menuId?: string;
  @Output() close = new EventEmitter<void>();
  menuDetails: any;
  quantity: number = 1;
  totalPrice: number = 0;
  sizes = ["tall", "grande", "venti"];
  selectedSize?: string;
  sizeImages = [
    '../../../assets/tall.png',
    '../../../assets/grande.png',
    '../../../assets/venti.png'
  ];

  constructor(private menupopupService: MenupopupService) { }

  ngOnInit(): void {
    this.loadMenuDetails();
    console.log("DATATATATATATATATATATUDBQ")
    console.log(this.menuDetails)
  }

  loadMenuDetails() {
    this.menupopupService.getMenuDetails(this.menuId!).subscribe((data) => {
      this.menuDetails = data;
      console.log(this.menuDetails)
    });
  }

  // ฟังก์ชันเพื่อเลือกภาพที่ตรงกับขนาด
  getImageSource(index: any): string {
    return this.sizeImages[index] || 'default-image.png'; // กรณีไม่มีภาพให้ใช้ default
  }

  getPrice(size: string): number {
    switch (size) {
      case 'tall': return this.menuDetails?.s_price || 0;
      case 'grande': return this.menuDetails?.m_price || 0;
      case 'venti': return this.menuDetails?.l_price || 0;
      default: return 0;
    }
  }

  getOz(size: string): string {
    switch (size) {
      case 'tall': return "(16oz)";
      case 'grande': return "(24oz)";
      case 'venti': return "(32oz)";
      default: return "";
    }
  }

  updateTotalPrice() {
    // คำนวณ totalPrice จากขนาดที่เลือกและ quantity
    this.totalPrice = this.getPrice(this.selectedSize!) * this.quantity;
  }

  onSizeChange(size: string) {
    this.selectedSize = size; // อัปเดตขนาดที่เลือก
    this.updateTotalPrice(); // คำนวณราคาใหม่
  }

  increaseQuantity() {
    this.quantity++;
    this.updateTotalPrice(); // คำนวณราคาใหม่
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateTotalPrice(); // คำนวณราคาใหม่
    }
  }

  closePopup() {
    this.close.emit(); // ส่งสัญญาณกลับไปที่ parent component
  }
}