import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adminorder',
  templateUrl: './adminorder.component.html',
  styleUrls: ['./adminorder.component.css']
})
export class AdminorderComponent {

  currentSection: string = 'all-orders'; // กำหนดค่าเริ่มต้นให้กับ section ที่จะแสดง
  menuSection: string = 'all-menu';

  showSection(sectionId: string): void {
    this.currentSection = sectionId; // เปลี่ยน section ที่จะแสดงตามการคลิก
  }
  
  BeveragemenuForm = new FormGroup({
    name: new FormControl(''),
    tallcupprice: new FormControl(''),
    grandecupprice: new FormControl(''),
    venticupprice: new FormControl(''),
    hot: new FormControl(false),
    iced: new FormControl(false),
    frappe: new FormControl(false),
    upload: new FormControl(null),
    status: new FormControl('status'),

  });
  
  orders = [
    {
      image: 'assets/images/iced-espresso-coffee.jpg',
      name: 'ICED ESPRESSO COFFEE',
      description: 'SWEET: 25% \nSIZE: TALL \nUsername: myde',
      quantity: 'X2',
      price: 138
    },
    {
      image: 'assets/images/classic-chocolate-cake.jpg',
      name: 'CLASSIC CHOCOLATE CAKE',
      description: 'เค้กช็อกโกแลตสดสลับพร้อมไอศครีมช็อกโกแลต \nUsername: myde',
      quantity: 'X1',
      price: 99
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA \nUsername: myde',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA \nUsername: myde',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA \nUsername: myde',
      quantity: 'X2',
      price: 176
    }
  ];

  menu = [
    {
      image: 'assets/images/iced-espresso-coffee.jpg',
      name: 'ICED ESPRESSO COFFEE',
      description: 'SWEET: 25% \nSIZE: TALL',
      quantity: 'X2',
      price: 138
    },
    {
      image: 'assets/images/classic-chocolate-cake.jpg',
      name: 'CLASSIC CHOCOLATE CAKE',
      description: 'เค้กช็อกโกแลตสดสลับพร้อมไอศครีมช็อกโกแลต',
      quantity: 'X1',
      price: 99
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA',
      quantity: 'X2',
      price: 176
    },
    {
      image: 'assets/images/iced-matcha-milk.jpg',
      name: 'ICED MATCHA MILK',
      description: 'SWEET: 75% \nSIZE: TRENTA',
      quantity: 'X2',
      price: 176
    }
  ];

  ngOnInit(): void {}
  
}
