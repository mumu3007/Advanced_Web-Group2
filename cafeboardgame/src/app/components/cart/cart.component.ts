import { Component } from '@angular/core';
import { CartsService } from '../../services/carts/carts.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: any;

  constructor(private cartsService: CartsService) {}

  ngOnInit(): void {
    this.loadCart('userId123'); // Replace with actual user ID
  }

  loadCart(userId: string): void {
    this.cartsService.getCart(userId).subscribe(
      (cart) => this.cart = cart,
      (error) => console.error('Error loading cart:', error)
    );
  }

  addItemsToCart(ordercoffeeIds: string[], cakeIds: string[], boardgameIds: string[]): void {
    const cartData = {
      user_id: '66da8788376323eb83a883d3', // Replace with actual user ID
      ordercoffee_id: ordercoffeeIds,
      cake_id: cakeIds,
      boardgame_id: boardgameIds
    };

    this.cartsService.addCartItem(cartData).subscribe(
      (response) => console.log('Item added to cart:', response),
      (error) => console.error('Error adding item:', error)
    );
  }
}
