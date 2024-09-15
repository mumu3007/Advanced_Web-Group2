import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/menu/menuservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder and FormGroup

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuItems: any[] = [];
  cakeItems: any[] = [];
  displayedMenuItems: any[] = [];
  displayedCakeItems: any[] = [];
  recommendedItems: any[] = [];
  selectedItem: any;
  sizes = ['tall', 'grande', 'venti'];
  currentPage: number = 0;
  currentCakePage: number = 0;
  itemsPerPage: number = 6;
  totalPrice = 0;
  showPopup = false;
  showCakePopup = false;
  selectedMenuId?: string;
  selectedCakeId?: string;

  // ฟอร์มควบคุม
  // Add FormGroup

  openPopup(menuId: string) {
    this.selectedMenuId = menuId;
    this.showPopup = true;
    console.log(menuId);
  }


  closePopup() {
    this.showPopup = false;
    this.showCakePopup = false;
  }

  openCakePopup(cakeId: string) {
    this.selectedCakeId = cakeId;
    this.showCakePopup = true;
    console.log(cakeId);
  }

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadCakeItems();
    this.loadRecommendedItems()
    // Subscribe to form changes to update total price
    // this.cartForm.valueChanges.subscribe(() => this.calculateTotalPrice());
  }

  cartForm = this.fb.group({
    selectedOption: ['hot', Validators.required], // Default to 'hot'
    selectedSweetness: ['50%', Validators.required], // Default to '50%'
    additionalDetails: [''],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  loadMenuItems() {
    this.apiService.getMenuItems().subscribe(
      (data) => {
        this.menuItems = data;
        this.displayedMenuItems = this.menuItems.slice(0, this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  loadCakeItems() {
    this.apiService.getCakeItems().subscribe(
      (data) => {
        this.cakeItems = data;
        this.displayedCakeItems = this.cakeItems.slice(0, this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  loadRecommendedItems() {
    this.apiService.getRecommendedItems().subscribe(
      (data) => {
        this.recommendedItems = data;
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  getPriceBySize(item: any, index: number): number {
    switch (index) {
      case 0:
        return item.s_price;  // TALL
      case 1:
        return item.m_price;  // GRANDE
      case 2:
        return item.l_price;  // VENTI
      default:
        return 0;
    }
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ฟังก์ชันเปิด popup


  updateDisplayedMenuItems() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedMenuItems = this.menuItems.slice(start, end);
    console.log("refresh complete")
  }

  updateDisplayedCakeItems() {
    const start = this.currentCakePage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCakeItems = this.cakeItems.slice(start, end);
    console.log("refresh complete")
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.menuItems.length) {
      this.currentPage++;
      this.updateDisplayedMenuItems();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedMenuItems();
    }
  }
  nextCakePage() {
    if ((this.currentCakePage + 1) * this.itemsPerPage < this.cakeItems.length) {
      this.currentCakePage++;
      this.updateDisplayedCakeItems();
    }
  }

  prevCakePage() {
    if (this.currentCakePage > 0) {
      this.currentCakePage--;
      this.updateDisplayedCakeItems();
    }
  }

  // ฟังก์ชันเพิ่มไปยังตะกร้า
  addToCart() {
    if (this.cartForm.valid) {
      console.log('Added to cart:', this.selectedItem.name);
      this.closePopup();
    }
  }

  

}

