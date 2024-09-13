import { Component, OnInit } from '@angular/core';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-card-carousel',
  templateUrl: './boardgame.component.html',
  styleUrls: ['./boardgame.component.css']
})
export class BoardgameComponent implements OnInit {
totalPrice: any;

selectedBoardgameIds: string[] = []; // Store selected boardgame IDs to add to cart


  currentIndex = 0;
  boardgameItems: any[] = [];
  boardgameItemsdesc: any[] = [];
  boardgameinactiveItem: any[] = [];
  displayedItems: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;
  showPopupSelectItem: boolean = false;
  selectedItem: any;
  showPopup: boolean = false;
  selectedPrice: number = 0;
  userId: string | null =null;
  
  constructor(private boardgameservice :BoardgameserviceService ,
     private fb: FormBuilder,
     private cartsService: CartsService,
     private authService :AuthService,
     private toastr: ToastrService) { }

  selectBoardgame(boardgameId: string): void {
    // Toggle selection (add or remove from selected array)
    const index = this.selectedBoardgameIds.indexOf(boardgameId);
    if (index === -1) {
      this.selectedBoardgameIds.push(boardgameId);
      this.toastr.success('Item has been added to the cart!');
      console.log("เช็ค addtocart"+ this.addToCart)
    } else {
      this.selectedBoardgameIds.splice(index, 1);
    }
  }


  addToCart(): void {
    // Replace with the actual user ID

    // Use CartsService to add the selected boardgames to the cart
    this.cartsService.addCartItem({
      user_id: this.userId ?? undefined,
      ordercoffee_id: [], 
      cake_id: [],       
      boardgame_id: this.selectedBoardgameIds // Add selected boardgames
    }).subscribe(
      (cart) => {
        console.log('Boardgames added to cart:', cart);
      },
      (error) => {
        console.error('Error adding boardgames to cart:', error);
      }
    );
  }
togglePopup(price: number) {
  this.selectedPrice = price;
  this.showPopup = !this.showPopup; // Toggle modal visibility
}

  ngOnInit(): void {
    this.loadMenuItems();
    this.Get3BoardgameItems();
    this.GetinactiveBoardgameItems();


    this.authService.getUserId().subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadUserData(this.userId); // ใช้ userId ในการโหลดข้อมูลอื่น ๆ
      }
    });
    
  }
  loadUserData(id: string) {
    console.log('User ID:', id);
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
    return this.boardgameinactiveItem.slice(this.currentIndex, this.currentIndex + 2);
  }

  moveRight() {
    this.currentIndex = (this.currentIndex + 2) % this.boardgameinactiveItem.length;
  }

  moveLeft() {
    this.currentIndex = (this.currentIndex - 2 + this.boardgameinactiveItem.length) % this.boardgameinactiveItem.length;
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
    price: [{ value: 0, disabled: true }], 
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
      const maxQuantity = this.selectedItem?.quantity; // Optional chaining to handle null or undefined
    
      if (currentQuantity != null && maxQuantity != null && currentQuantity < maxQuantity) {
        // Increment the quantity
        this.cartForm.patchValue({ quantity: currentQuantity + 1 });
    
        // Calculate and update the total price based on the new quantity
        const updatedQuantity = this.cartForm.get('quantity')?.value;
        if (updatedQuantity != null && this.selectedItem?.price != null) {
          const totalPrice = updatedQuantity * this.selectedItem.price;
          this.totalPrice = totalPrice; // Store the updated total price
        }
      }
    }
    


  // ลดจำนวน
  decreaseQuantity() {
    const currentQuantity = this.cartForm.get('quantity')?.value;
  
    if (currentQuantity != null && currentQuantity > 1) {
      // Decrement the quantity
      this.cartForm.patchValue({ quantity: currentQuantity - 1 });
  
      // Calculate and update the total price based on the new quantity
      const updatedQuantity = this.cartForm.get('quantity')?.value;
      if (updatedQuantity != null && this.selectedItem?.price != null) {
        const totalPrice = updatedQuantity * this.selectedItem.price;
        this.totalPrice = totalPrice; // Store the updated total price
      }
    }
  }
}
