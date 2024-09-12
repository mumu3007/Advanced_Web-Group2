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


  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  closePopup() {
    this.close.emit(); // ส่งสัญญาณกลับไปที่ parent component
  }
}