import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist: Set<number> = new Set();  // Set to store product IDs
  private products: Product[] = [];  // Your list of products, you might want to fetch this from an API

  // Add product to wishlist
  addToWishlist(product: Product): void {
    this.wishlist.add(product.id);
    this.products.push(product);
  }

  // Remove product from wishlist
  removeFromWishlist(productId: number): void {
    this.wishlist.delete(productId);
    this.products = this.products.filter(product => product.id !== productId);
  }

  // Get wishlist items
  getWishlistItems(): Product[] {
    return this.products.filter(product => this.wishlist.has(product.id));
  }

  // Check if product is in wishlist
  isInWishlist(product: Product): boolean {
    return this.wishlist.has(product.id);
  }
}
