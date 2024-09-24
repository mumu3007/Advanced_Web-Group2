import { Component, HostListener, OnInit } from '@angular/core';
import { BoardgameserviceService } from '../../services/boardgame/boardgameservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';

import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './boardgame.component.html',
  styleUrls: ['./boardgame.component.css'],

})
export class BoardgameComponent implements OnInit {

  // --------------------------------------------------------Parameter variable
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
  scrollPosition: number = 0;
  sectionlefttoright: string | undefined;
  sectionrigthtoleft: string | undefined;
  sectionopcity1: string | undefined;
  sectionopcity2: string | undefined;

  //---------------------------------------------------------Constructor
  constructor(private boardgameservice :BoardgameserviceService ,
     private fb: FormBuilder,
     private cartsService: CartsService,
     private authService :AuthService,
     private messageService: MessageService,
     private router: Router
     ) {  this.adjustItemsPerPage(window.innerWidth);

     }
//---------------------------------------------OnInit
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
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustItemsPerPage(event.target.innerWidth);
  }
  adjustItemsPerPage(width: number) {
    if (width < 640) { // For screens smaller than 640px
      this.itemsPerPage = 2;
    } else if (width >= 640 && width < 1024) { // For screens between 640px and 1024px
      this.itemsPerPage = 4;
    } else { // For screens larger than 1024px
      this.itemsPerPage = 6;
    }
    this.loadMenuItems();
    this.updateDisplayedItems()
  }

  //-----------------------------------------------------จับ  event เลื่อนหน้าจอ กับ animation
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.scrollPosition = window.scrollY || document.documentElement.scrollTop;

    if (this.scrollPosition > 25){
      this.sectionopcity1 = 'lg:animate-opacityfade'
    }
    else{
      this.sectionopcity1 = 'lg:hidden'
    }
  
    if (this.scrollPosition > 480) {
      this.sectionlefttoright = 'lg:animate-lefttoright';
      this.sectionrigthtoleft = 'lg:animate-righttoleft' // เปลี่ยนสีพื้นหลังตามที่ต้องการ
    } else {
      this.sectionlefttoright = 'lg:hidden'; // สีพื้นหลังเริ่มต้น
      this.sectionrigthtoleft = 'lg:hidden'; // สีพื้
    }
    if (this.scrollPosition > 850){
      this.sectionopcity2 = 'lg:animate-opacityfade'
    }
    else{
      this.sectionopcity2 = 'lg:hidden'
    }
    console.log("scoll => "+this.scrollPosition)
  }

  //-------------------------------------------------------add cart


  addToCart(): Promise<void> {
    return new Promise<void>((resolve) =>{
    const quantity = this.cartForm.get('quantity')?.value ?? 1;
    // Assuming `this.selectedBoardgameIds` and `this.boardgameQuantity` are properly populated
    const payload = {
      user_id: this.userId ?? undefined,
      ordercoffee_id: [], 
      ordercake_id: [],    
      boardgame_id: this.selectedBoardgameIds,
      boardgame_quantity: Array(this.selectedBoardgameIds.length).fill(quantity) // Fill quantity for all selected boardgames
    };
  
    this.cartsService.addCartItem(payload).subscribe(
      (cart) => {
        console.log(payload)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Boardgames added to cart',
        });
        resolve()
        this.selectedBoardgameIds = [];
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Add to cart failed. Please try again.',
        });
      }
    );
  }
)}



//---------------------------------------------------------- loadData
  selectBoardgame(boardgameId: string): Promise<void> {
    return new Promise<void>((resolve) => {
    // Toggle selection (add or remove from selected array)
    const index = this.selectedBoardgameIds.indexOf(boardgameId);
    if (index === -1) {
      this.selectedBoardgameIds.push(boardgameId);
      
      console.log("เช็ค addtocart"+ this.addToCart)
      resolve();
    } else {
      this.selectedBoardgameIds.splice(index, 1);
    }
  }
)}
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
    return this.boardgameinactiveItem
  }


//----------------------------------------------------- slice show
updateDisplayedItems() {
  const start = this.currentPage * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.displayedItems = this.boardgameItems.slice(start, end);
  console.log("Page updated: ", this.displayedItems);
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
//--------------------------------------------- Form
  cartForm = this.fb.group({
    price: [{ value: 0, disabled: true }], 
    quantity: [1, [Validators.required, Validators.min(1)]]
  });
    resetForm() {
      this.cartForm.reset({
        quantity: 1
      });
    }
    

//---------------------------------------------- increase Decrease Quan
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
  //--------------------------------------------Popup
    
togglePopup(price: number) {
  this.selectedPrice = price;
  this.showPopup = !this.showPopup; // Toggle modal visibility
}
openPopup(item: any) {
  this.selectedItem = item;
  this.showPopupSelectItem = !this.showPopupSelectItem;

}
closePopup() {

  this.showPopupSelectItem = !this.showPopupSelectItem;
  this.resetForm();

}

  async   buyNow(boardgameId: string){
    await this.selectBoardgame(boardgameId)
    await this.addToCart()
    this.router.navigate(['/cart']);
  }
}
