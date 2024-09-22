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

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadCakeItems();
    this.loadRecommendedItems()
  }

  openPopup(menuId: string) {
    this.selectedMenuId = menuId;
    this.showPopup = true;
    console.log(menuId);
  }

  openCakePopup(cakeId: string) {
    this.selectedCakeId = cakeId;
    this.showCakePopup = true;
    console.log(cakeId);
  }

  closePopup() {
    this.showPopup = false;
    this.showCakePopup = false;
  }

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

  updateDisplayedItems(type: 'beverage' | 'cake'): void {
    if (type === 'beverage') {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.displayedMenuItems = this.menuItems.slice(start, end);
    } else if (type === 'cake') {
      const start = this.currentCakePage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.displayedCakeItems = this.cakeItems.slice(start, end);
    }
  }

  nextPage(type: 'beverage' | 'cake'): void {
    if (type === 'beverage') {
      if ((this.currentPage + 1) * this.itemsPerPage < this.menuItems.length) {
        this.currentPage++;
        this.updateDisplayedItems('beverage');
      }
    } else if (type === 'cake') {
      if ((this.currentCakePage + 1) * this.itemsPerPage < this.cakeItems.length) {
        this.currentCakePage++;
        this.updateDisplayedItems('cake');
      }
    }
  }

  prevPage(type: 'beverage' | 'cake'): void {
    if (type === 'beverage') {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updateDisplayedItems('beverage');
      }
    } else if (type === 'cake') {
      if (this.currentCakePage > 0) {
        this.currentCakePage--;
        this.updateDisplayedItems('cake');
      }
    }
  }
}

