import { Component, OnInit } from '@angular/core';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api'; 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId?: string | null | undefined;
  showPopup: boolean = false;
  selectedPrice: number = 0;
  selectedCartId: string | null | undefined
  cartCoffeeDetails: any[] = [];
  cartCakeDetails: any[] = [];
  cartAllName: any[] = [];
  cakeItems: any[] = [];

  constructor(private cartsService: CartsService, private authService: AuthService,private messageService: MessageService ) { }

  ngOnInit(): void {
    if (!this.userId) {
      this.authService.getUserId().subscribe((id) => {
        console.log('User ID:', id); 
        if (id && !this.userId) {
          this.userId = id;
          this.loadUserData(this.userId);
          this.loadCart(this.userId); 
        } else {
          console.error('User ID not found');
        }
      });
    }
    
  }
  
  loadUserData(id: string) {
    console.log('User ID:', id);
  }

  loadCart(userId: string): void {
    this.cartsService.getCart(userId).subscribe(
      (cart) => {
        console.log(cart)

        this.cartCoffeeDetails = [];
        this.cartCakeDetails = [];
        this.cartAllName = [];
        this.selectedCartId = cart.cart._id;

        const boardgameItems = [
          ...cart.cart.boardgame_id
        ];

        cart.cart.ordercoffee_id.forEach((ordercoffee: any) => {
          
          const orderId = ordercoffee._id;
          const coffeeName = ordercoffee.coffee_id.name;
          const coffeeSize = ordercoffee.size
          const coffeeSweet = ordercoffee.sweetness_level
          const coffeeQuantity = ordercoffee.quantity || 0;
          const coffeeTotalPrice = ordercoffee.total_price;
          const coffeePhoto = `${this.cartsService.getBaseUrl()}/${ordercoffee.coffee_id.photo.filePath}`; 

          this.cartCoffeeDetails.push({
            _id: orderId,
            name: coffeeName,
            size: coffeeSize,
            sweetness_level: coffeeSweet,
            quantity: coffeeQuantity,
            total_price: coffeeTotalPrice,
            photo: coffeePhoto
          });

          this.cartAllName.push({
            _id: orderId,
            name: coffeeName,
            total_price: coffeeTotalPrice,
          });

          this.totalPrice += coffeeTotalPrice
        });


        const sameCakeItems: { [key: string]: any } = {}
        cart.cart.ordercake_id.forEach((ordercake: any) => {
          const cakeId = ordercake.cake_id._id;
          const cakeName = ordercake.cake_id.name;
          const cakeQuantity = ordercake.quantity || 0;
          const cakeTotalPrice = ordercake.total_price;
          const cakeDescription = ordercake.cake_id.description
          const cakePhotoUrl = `${this.cartsService.getBaseUrl()}/${ordercake.cake_id.photo.filePath}`;

          if (!sameCakeItems[cakeName]) {
            sameCakeItems[cakeName] = {
              ...ordercake,
              cake_id: cakeId,
              name: cakeName,
              description: cakeDescription,
              quantity: cakeQuantity, 
              total_price: cakeTotalPrice, 
              photo: cakePhotoUrl
            };

          } else {
            sameCakeItems[cakeName].quantity += cakeQuantity;
            sameCakeItems[cakeName].total_price += cakeTotalPrice; 
          }

          const existingItemIndex = this.cartAllName.findIndex((item) => item._id === cakeId);

          if (existingItemIndex !== -1) {
            this.cartAllName[existingItemIndex].total_price += cakeTotalPrice;
          } else {
            this.cartAllName.push({
              _id: cakeId,
              name: cakeName,
              total_price: cakeTotalPrice,
            });
          }
        });

        const combinedItems: { [key: string]: any } = {};
        boardgameItems.forEach((item: any) => {
          console.log(item)
          const boardgamePhotoUrl = `${this.cartsService.getBaseUrl()}/${item.photo.filePath}`; 
          const id = item._id.toString();

          if (!combinedItems[id]) {
            combinedItems[id] = {
              ...item,
              quantity: 1,
              type: item.type ? item.type.name : 'Unknown',
              photo: boardgamePhotoUrl
            };
          } else {
            combinedItems[id].quantity++;
          }
        });

        this.cartItems = Object.values(combinedItems);
        this.cakeItems = Object.values(sameCakeItems);
        console.log("cartCoffeeItems:", this.cartCoffeeDetails)
        console.log("cakeItems:",this.cakeItems)
        console.log("cartItems:",this.cartItems)
        console.log("cartAllName:", this.cartAllName)
        this.calculateTotalPrice()

      },
      (error) => console.error('Error loading cart:', error)
    );
  }

  deleteOrderCoffee(ordercoffee_id: string) {
    this.cartsService.deleteOrdercoffee(ordercoffee_id).subscribe(
      (response) => {
        console.log('Delete successful:', response);

        this.cartCoffeeDetails = this.cartCoffeeDetails.filter(item => item._id !== ordercoffee_id);
        this.totalPrice = this.cartCoffeeDetails.reduce((sum, item) => sum + item.total_price, 0);
        this.loadCart(this.userId!);
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  deleteOrderCake(cakeId:string) {
    console.log(this.userId)
    console.log(cakeId)
    this.cartsService.deleteOrdercake(this.userId!, cakeId).subscribe(
      (response) => {
        console.log('Delete successful:', response);

        this.cakeItems = this.cakeItems.filter(item => item.cake_id !== cakeId);
        this.totalPrice = this.cakeItems.reduce((sum, item) => sum + item.total_price, 0);
        this.loadCart(this.userId!);
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  deleteOrderBoardgame(boardgameId: string) {
    console.log(this.userId)
    console.log(boardgameId)
    this.cartsService.deleteOrderboardgame(this.userId! ,boardgameId).subscribe(
      (response) => {
        console.log('Delete successful:', response);

        this.cartItems = this.cartItems.filter(item => item._id !== boardgameId);
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        this.loadCart(this.userId!);
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    this.totalPrice += this.cartCoffeeDetails.reduce((sum, item) => sum + item.total_price, 0);
    this.totalPrice += this.cakeItems.reduce((sum, item) => sum + item.total_price, 0);
    this.totalPrice += this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  togglePopup() {


    const hasCoffeeItems = this.cartCoffeeDetails.length > 0;
    const hasCakeItems = this.cakeItems.length > 0;
    const hasBoardgameItems = this.cartItems.length > 0;
  
    
    if (hasCoffeeItems || hasCakeItems || hasBoardgameItems) {
      this.showPopup = !this.showPopup;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No items in the cart',
      });
    }


  }
}

