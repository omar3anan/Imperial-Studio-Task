import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { WishlistService } from '../../services/wishlist.service';  // Import WishlistService
import { Product } from '../../models/product.model';  // Import the Product model

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],  // Include CommonModule in imports
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];  // Array to store wishlist items
  wishlistLoading: boolean = true;  // Flag for loading state
  wishlistError: string = '';       // Holds error messages (if any)

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    // Simulate asynchronous loading of wishlist items:
    try {
      // Retrieve wishlist items from the WishlistService
      this.wishlistItems = this.wishlistService.getWishlistItems();
      this.wishlistLoading = false;
    } catch (error) {
      this.wishlistError = 'Failed to load wishlist';
      this.wishlistLoading = false;
    }
  }

  // Remove a product from the wishlist and update the list
  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id);
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }
}
