// src/app/models/cart.model.ts
export interface CartItem {
    _id?: string; // Optional field for MongoDB ObjectId
    total_price?: number;
    user_id?: string; // User ID as a string
    ordercoffee_id?: string[]; // Array of Object IDs as strings
    ordercake_id?: string[]; // Array of Object IDs as strings
    boardgame_id?: string[]; // Array of Object IDs as strings
  }
  