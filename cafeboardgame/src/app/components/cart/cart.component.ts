import { Component } from '@angular/core';
import { CartsService } from '../../services/carts/carts.service';
interface CartItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: any;

  constructor(private cartsService: CartsService) {}

  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'POWER HUNGRY PETS (TH)',
      description: 'CATEGORY : FAMILY GAME, PARTY GAME',
      quantity: 2,
      price: 162,
      image: 'assets/power-hungry-pets.jpg',
    },
    {
      id: 2,
      name: 'BERRY CHANTILLY CAKE',
      description: 'ครัวซองต์เพรชเบอร์รีครีมโฮลิค',
      quantity: 2,
      price: 99,
      image: 'assets/berry-chantilly-cake.jpg',
    },
    {
      id: 3,
      name: 'ICED LATTE COFFEE',
      description: 'SWEET : 75%, SIZE : TRENTA',
      quantity: 2,
      price: 89,
      image: 'assets/iced-latte-coffee.jpg',
    },
  ];

  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }
  
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
