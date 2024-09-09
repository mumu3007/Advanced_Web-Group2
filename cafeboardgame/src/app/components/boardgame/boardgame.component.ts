import { Component, OnInit } from '@angular/core';
import { BoardgameserviceService } from '../../services/boardgameservice.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './boardgame.component.html',
  styleUrls: ['./boardgame.component.css']
})
export class BoardgameComponent implements OnInit {
totalPrice: any;
decreaseQuantity() {
throw new Error('Method not implemented.');
}


  currentIndex = 0;
  boardgameItems: any[] = [];
  boardgameItemsdesc: any[] = [];
  boardgameinactiveItem: any[] = [];
  displayedItems: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;
  showPopup: boolean = false;
  selectedItem: any;
constructor(private boardgameservice :BoardgameserviceService , private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.Get3BoardgameItems();
    this.GetinactiveBoardgameItems();
    console.log("boardgame => "+this.boardgameinactiveItem)
  }



  

loadMenuItems() {
  this.boardgameservice.getBoardgame().subscribe(
    (data) => {
      this.boardgameItems = data;
      this.displayedItems = this.boardgameItems.slice(0, this.itemsPerPage);
      console.log(this.displayedItems)
    },
    (error) => {
      console.error('Error fetching menu:', error);
    }
  );
}
Get3BoardgameItems() {
  this.boardgameservice.get3Boardgame().subscribe(
    (data) => {
      this.boardgameItemsdesc = data;
      
    },
    (error) => {
      console.error('Error fetching menu:', error);
    }
  );
}
GetinactiveBoardgameItems() {
  this.boardgameservice.getinactiveboardgame().subscribe(
    (data) => {
      this.boardgameinactiveItem = data;
    },
    (error) => {
      console.error('Error fetching menu:', error);
    }
  );
}

  get displayedCards() {
    return this.boardgameinactiveItem.slice(this.currentIndex, this.currentIndex + 3);
  }

  moveRight() {
    this.currentIndex = (this.currentIndex + 1) % this.boardgameinactiveItem.length;
  }

  moveLeft() {
    this.currentIndex = (this.currentIndex - 1 + this.boardgameinactiveItem.length) % this.boardgameinactiveItem.length;
  }

  updateDisplayedItems() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedItems = this.boardgameItems.slice(start, end);
    console.log("refresh complete")
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.boardgameItems.length) {
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
    // ฟังก์ชันเปิด popup
    openPopup(item: any) {
      this.selectedItem = item;
      this.showPopup = !this.showPopup;
   
    }
    closePopup() {

      this.showPopup = !this.showPopup;
      this.resetForm();
   
    }
  resetForm() {
    throw new Error('Method not implemented.');
  }

}
