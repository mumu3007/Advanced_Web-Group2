import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenupopupService } from '../../services/menupopup/menupopup.service';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';
import { OrdersService } from '../../services/order/order.service';

@Component({
  selector: 'app-menu-popup',
  templateUrl: './menupopup.component.html',
  styleUrls: ['./menupopup.component.css'],
})
export class MenupopupComponent implements OnInit {
  @Input() menuId?: string;
  @Output() close = new EventEmitter<void>();
  menuDetails: any;
  quantity: number = 1;
  totalPrice: number = 0;
  sizes = ['tall', 'grande', 'venti'];
  selectedSize?: string;
  sizeImages = [
    '../../../assets/tall.png',
    '../../../assets/grande.png',
    '../../../assets/venti.png',
  ];
  userId: string | null = null;
  selectedMenuIds: string[] = [];
  orderForm: FormGroup;

  constructor(
    private menupopupService: MenupopupService,
    private cartsService: CartsService,
    private authService: AuthService,
    private fb: FormBuilder,
    private ordersService: OrdersService
  ) {
    this.orderForm = this.fb.group({
      type_order: ['', Validators.required],
      sweetness_level: [0, Validators.required],
      size: ['', Validators.required],
      description: [''],
      coffee_id: [''],
      quantity: [1, Validators.required],
      total_price: [0],
    });
  }

  ngOnInit(): void {
    this.loadMenuDetails();
    this.authService.getUserId().subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadUserData(this.userId);
      }
    });
  }



  loadUserData(id: string) {
    console.log('User ID:', id);
  }

  loadMenuDetails() {
    this.menupopupService.getMenuDetails(this.menuId!).subscribe((data) => {
      this.menuDetails = data;
      this.orderForm.patchValue({ coffee_id: data._id }); // Set coffee_id in the form
    });
  }

  getImageSource(index: number): string {
    return this.sizeImages[index] || 'default-image.png';
  }

  getPrice(size: string): number {
    switch (size) {
      case 'tall':
        return this.menuDetails?.s_price || 0;
      case 'grande':
        return this.menuDetails?.m_price || 0;
      case 'venti':
        return this.menuDetails?.l_price || 0;
      default:
        return 0;
    }
  }

  getOz(size: string): string {
    switch (size) {
      case 'tall':
        return '(16oz)';
      case 'grande':
        return '(24oz)';
      case 'venti':
        return '(32oz)';
      default:
        return '';
    }
  }

  updateTotalPrice() {
    this.totalPrice = this.getPrice(this.selectedSize!) * this.quantity;
    this.orderForm.patchValue({ total_price: this.totalPrice, quantity: this.quantity });
  }

  onSizeChange(size: string) {
    this.selectedSize = size;
    this.updateTotalPrice();
  }

  increaseQuantity() {
    this.quantity++;
    this.updateTotalPrice();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateTotalPrice();
    }
  }
  // onSubmit() {

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      this.ordersService.addOrdersItem(orderData).subscribe(
        (order) => {
          console.log('Order added to order:', order);
          console.log(orderData)

          this.cartsService.addCartItem({
            user_id: this.userId ?? undefined,
            ordercoffee_id: [order._id],  // ส่ง id ของ ordercoffee ที่เพิ่งสร้างไป
            ordercake_id: [],
            boardgame_id: [],
          }).subscribe(
            (cart) => {
              console.log('Order added to cart:', cart);
              this.closePopup()
            },
            (error) => {
              console.error('Error adding order to cart:', error);
            }
          );
        },
        (error) => {
          console.error('Error adding order to order:', error);
          console.log(orderData)
        }
      );
    }
  }

  closePopup() {
    this.close.emit();
  }

  buyNow() {
    console.log('Processing buy now...');
    // Logic for "Buy Now" action
  }
}
