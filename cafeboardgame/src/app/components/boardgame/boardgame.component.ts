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




  currentIndex = 0;
  boardgameItems: any[] = [];
  boardgameItemsdesc: any[] = [];
  boardgameinactiveItem: any[] = [];
  displayedItems: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;
  showPopupSelectItem: boolean = false;
  selectedItem: any;
constructor(private boardgameservice :BoardgameserviceService , private fb: FormBuilder) { }

showPopup: boolean = false;
selectedPrice: number = 245; // Set the default price (or change dynamically)

togglePopup(price: number) {
  this.selectedPrice = price;
  this.showPopup = !this.showPopup; // Toggle modal visibility
}

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

  cartForm = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedItems();
    }
  }
    // ฟังก์ชันเปิด popup
    openPopup(item: any) {
      this.selectedItem = item;
      this.showPopupSelectItem = !this.showPopupSelectItem;
   
    }
    closePopup() {

      this.showPopupSelectItem = !this.showPopupSelectItem;
      this.resetForm();
   
    }
    resetForm() {
      this.cartForm.reset({
        quantity: 1
      });
    }
    


  increaseQuantity() {
    const currentQuantity = this.cartForm.get('quantity')?.value;
    if (currentQuantity! < this.selectedItem.quantity)
    this.cartForm.patchValue({ quantity: currentQuantity! + 1 });
  }

  // ลดจำนวน
  decreaseQuantity() {
    const currentQuantity = this.cartForm.get('quantity')?.value;
    if (currentQuantity! > 1) {
      this.cartForm.patchValue({ quantity: currentQuantity! - 1 });
    }
  }
}
