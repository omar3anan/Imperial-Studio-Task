import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';  // Add ProductService to fetch all products
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];
  wishlistLoading: boolean = true;
  wishlistError: string = '';
  userId: number = Number(localStorage.getItem('userId'));  // Assuming user ID is stored in localStorage
  products: Product[] = []; // Array to hold all available products

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService  // Inject ProductService
  ) {}

  ngOnInit(): void {
    // Fetch all products first
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;  // Save all products to use in the wishlist
        // Now fetch the wishlist items
        this.loadWishlist();
      },
      error: () => {
        this.wishlistError = 'Failed to load products';
        this.wishlistLoading = false;
      }
    });
  }

  // Fetch wishlist items and map the product IDs to Product objects
  loadWishlist(): void {
    this.wishlistService.getWishlistItems(this.userId).subscribe({
      next: (response) => {
        const productIds = response.wishlist; // Array of product IDs

        // Map the product IDs to actual Product objects using filter
        this.wishlistItems = this.products.filter(product => productIds.includes(product.id));

        this.wishlistLoading = false;
      },
      error: () => {
        this.wishlistError = 'Failed to load wishlist';
        this.wishlistLoading = false;
      }
    });
  }

  // Remove product from wishlist
  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id, this.userId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== product.id);
      },
      error: () => {
        this.wishlistError = 'Failed to remove product from wishlist';
      }
    });
  }
}
