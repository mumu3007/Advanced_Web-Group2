import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminorder',
  templateUrl: './adminorder.component.html',
  styleUrls: ['./adminorder.component.css']
})
export class AdminorderComponent {
  orders = [
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
