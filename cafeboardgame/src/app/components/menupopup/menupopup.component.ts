import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenupopupService } from '../../services/menupopup/menupopup.service';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';
import { OrdersService } from '../../services/order/order.service';
import { Router } from '@angular/router';

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
    private ordersService: OrdersService,
    private router: Router
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

  closePopup() {
    this.close.emit();
  }

  buyNow() {
    if (this.orderForm.valid) {
      this.onSubmit().then(() => {
        this.router.navigate(['/cart']);
      });
    }
  }

  onSubmit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.orderForm.valid) {
        const orderData = this.orderForm.value;
        this.ordersService.addOrdersItem(orderData).subscribe(
          (order) => {
            console.log('Order added to order:', order);

            this.cartsService.addCartItem({
              user_id: this.userId ?? undefined,
              ordercoffee_id: [order._id],
              ordercake_id: [],
              boardgame_id: [],
            }).subscribe(
              (cart) => {
                console.log('Order added to cart:', cart);
                this.closePopup();
                resolve(); // เมื่อการทำงานสำเร็จ ให้เรียก resolve()
              },
              (error) => {
                console.error('Error adding order to cart:', error);
                reject(error); // หากเกิดข้อผิดพลาด ให้ reject()
              }
            );
          },
          (error) => {
            console.error('Error adding order to order:', error);
            reject(error); // หากเกิดข้อผิดพลาด ให้ reject()
          }
        );
      } else {
        reject('Form is invalid');
      }
    });
  } 
}
