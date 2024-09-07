import { Component } from '@angular/core';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './boardgame.component.html',
  styleUrls: ['./boardgame.component.css']
})
export class BoardgameComponent {
  cards = [
    {
      img: '../../../assets/game1.png',
      title: 'POWER HUNGRY PETS (TH)',
      desc: 'ศึกป่วนก๊วนตัวเหมียว',
      price: '$595.00'
    },
    {
      img: '../../../assets/game2.png',
      title: 'POWER HUNGRY PETS (TH)',
      desc: 'ศึกป่วนก๊วนตัวเหมียว',
      price: '$595.00'
    },
    {
      img: '../../../assets/game3.png',
      title: 'POWER HUNGRY PETS (TH)',
      desc: 'ศึกป่วนก๊วนตัวเหมียว',
      price: '$595.00'
    },
    {
      img: '../../../assets/game4.png',
      title: 'NEW GAME 4',
      desc: 'รายละเอียดเกมใหม่',
      price: '$600.00'
    },
    {
      img: '../../../assets/game5.png',
      title: 'NEW GAME 5',
      desc: 'รายละเอียดเกมใหม่',
      price: '$650.00'
    }
  ];

  currentIndex = 0;
displayedItems: any;

  get displayedCards() {
    return this.cards.slice(this.currentIndex, this.currentIndex + 3);
  }

  moveRight() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  }

  moveLeft() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
  }
}
