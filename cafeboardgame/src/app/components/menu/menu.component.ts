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
  displayedItems: any[] = [];
  recommendedItems: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;
  showPopup = false;
  selectedItem: any;
  totalPrice=0;

  // ฟอร์มควบคุม
   // Add FormGroup

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadRecommendedItems()
    // Subscribe to form changes to update total price
    this.cartForm.valueChanges.subscribe(() => this.calculateTotalPrice());
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
        this.displayedItems = this.menuItems.slice(0, this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  loadRecommendedItems(){
    this.apiService.getRecommendedItems().subscribe(
      (data) => {
        this.recommendedItems = data;
      },
      (error) => {
        console.error('Error fetching menu:', error);
      }
    );
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ฟังก์ชันเปิด popup
  openPopup(item: any) {
    this.selectedItem = item;
    this.showPopup = true;
    this.calculateTotalPrice(); // อัปเดตราคารวมเมื่อเปิดป็อปอัป
  }

  // ฟังก์ชันปิด popup
  closePopup() {
    this.showPopup = false;
    this.resetForm();
  }

  updateDisplayedItems() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedItems = this.menuItems.slice(start, end);
    console.log("refresh complete")
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.menuItems.length) {
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

  // เพิ่มจำนวน
  increaseQuantity() {
    const currentQuantity = this.cartForm.get('quantity')?.value;
    this.cartForm.patchValue({ quantity: currentQuantity! + 1 });
  }

  // ลดจำนวน
  decreaseQuantity() {
    const currentQuantity = this.cartForm.get('quantity')?.value;
    if (currentQuantity! > 1) {
      this.cartForm.patchValue({ quantity: currentQuantity! - 1 });
    }
  }

  // คำนวณราคารวม
  calculateTotalPrice() {
    const { selectedOption, quantity } = this.cartForm.value;
    let basePrice = this.selectedItem.price;
    if (selectedOption === 'cold') {
      basePrice += 10;
    } else if (selectedOption === 'frappe') {
      basePrice += 20;
    }
    this.totalPrice = basePrice * quantity!;
  }

  // ฟังก์ชันเพิ่มไปยังตะกร้า
  addToCart() {
    if (this.cartForm.valid) {
      console.log('Added to cart:', this.selectedItem.name);
      this.closePopup();
    }
  }

  // รีเซ็ตฟอร์ม
  resetForm() {
    this.cartForm.reset({
      selectedOption: 'hot',
      selectedSweetness: '50%',
      additionalDetails: '',
      quantity: 1,
    });
    this.calculateTotalPrice();
  }
}
