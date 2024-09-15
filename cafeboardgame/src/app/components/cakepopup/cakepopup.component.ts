import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenupopupService } from '../../services/menupopup/menupopup.service';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';
import { OrdersService } from '../../services/order/order.service';

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
    private ordersService: OrdersService
  ) {
    this.cakeForm = this.fb.group({
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
      this.cakeForm.patchValue({ cake_id: data._id }); // Set coffee_id in the form
      this.totalPrice = this.cakeDetails.price
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



  onSubmit() {
    if (this.cakeForm.valid) {
      const orderCakeData = this.cakeForm.value;
      this.ordersService.addCakesItem(orderCakeData).subscribe(
        (ordercake) => {
          console.log('Order added to order:', ordercake);
          console.log(orderCakeData)

          this.cartsService.addCartItem({
            user_id: this.userId ?? undefined,
            ordercoffee_id: [],  // ส่ง id ของ ordercoffee ที่เพิ่งสร้างไป
            ordercake_id: [ordercake._id],
            boardgame_id: [],
          }).subscribe(
            (cart) => {
              console.log('OrderCake added to cart:', cart);
              this.closePopup()
            },
            (error) => {
              console.error('Error adding ordercake to cart:', error);
            }
          );
        },
        (error) => {
          console.error('Error adding ordercake to order:', error);
          console.log(orderCakeData)
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
