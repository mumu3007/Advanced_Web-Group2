import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenupopupService } from '../../services/menupopup/menupopup.service';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';
import { OrdersService } from '../../services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cake-popup',
  templateUrl: './cakepopup.component.html',
  styleUrl: './cakepopup.component.css'
})
export class CakepopupComponent {
  @Input() cakeId?: string;
  @Output() close = new EventEmitter<void>();
  cakeDetails: any;
  quantity: number = 1;
  totalPrice!: number;
  userId: string | null = null;
  selectedCakeIds: string[] = [];
  cakeForm: FormGroup;

  constructor(
    private menupopupService: MenupopupService,
    private cartsService: CartsService,
    private authService: AuthService,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.cakeForm = this.fb.group({
      user_id: [''],
      cake_id: [''],
      quantity: [1, Validators.required],
      total_price: [0],
    });
  }

  ngOnInit(): void {
    this.loadCakeDetails();
    this.authService.getUserId().subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadUserData(this.userId);

      }
    });
    this.totalPrice = this.cakeDetails.price
  }

  loadUserData(id: string) {
    console.log('User ID:', id);
  }


  loadCakeDetails() {
    this.menupopupService.getCakeDetails(this.cakeId!).subscribe((data) => {
      this.cakeDetails = data;
      this.cakeForm.patchValue({ cake_id: data._id });
      this.cakeForm.patchValue({ user_id: this.userId }); // Set coffee_id in the form
      this.updateTotalPrice();
    });
  }


  getPrice(): number {
    return this.cakeDetails?.price || 0;
  }


  updateTotalPrice() {
    this.totalPrice = this.getPrice() * this.quantity;
    this.cakeForm.patchValue({ total_price: this.totalPrice, quantity: this.quantity });
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



  onSubmit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cakeForm.valid) {
        const orderCakeData = this.cakeForm.value;
        this.ordersService.addCakesItem(orderCakeData).subscribe(
          (ordercake) => {
            console.log('Order added to order:', ordercake);
            console.log(orderCakeData)

            this.cartsService.addCartItem({
              user_id: ordercake.user_id,
              ordercoffee_id: [],  // ส่ง id ของ ordercoffee ที่เพิ่งสร้างไป
              ordercake_id: [ordercake._id],
              boardgame_id: [],
            }).subscribe(
              (cart) => {
                console.log('OrderCake added to cart:', cart);
                this.closePopup()
                resolve();
              },
              (error) => {
                console.error('Error adding ordercake to cart:', error);
                reject(error);
              }
            );
          },
          (error) => {
            console.error('Error adding ordercake to order:', error);
            console.log(orderCakeData)
            reject(error);
          }
        );
      } else {
        reject('Form is invalid');
      }
    }
    )
  }

  closePopup() {
    this.close.emit();
  }

  buyNow() {
    if (this.cakeForm.valid) {
      this.onSubmit().then(() => {
        this.router.navigate(['/cart']);
      });
    }
  }

}
