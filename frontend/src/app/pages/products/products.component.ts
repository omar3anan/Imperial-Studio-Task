import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  userId: number | null = Number(localStorage.getItem('userId')); // User ID can be null if not logged in
  wishlistItems: number[] = []; // Array to store product IDs in the wishlist

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all products regardless of whether the user is logged in or not
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;

        // If the user is logged in, load their wishlist
        if (this.userId) {
          this.loadWishlist();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  // Fetch the wishlist items (product IDs) from the backend if user is logged in
  loadWishlist(): void {
    if (this.userId) {
      this.wishlistService.getWishlistItems(this.userId).subscribe({
        next: (response) => {
          this.wishlistItems = response.wishlist;
        },
        error: () => {
          this.errorMessage = 'Failed to load wishlist';
        }
      });
    }
  }

  // Toggle the wishlist status of a product
  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product)) {
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(product.id, this.userId!).subscribe({
        next: () => {
          // Remove product ID from local wishlist array
          this.wishlistItems = this.wishlistItems.filter(item => item !== product.id);
        },
        error: () => {
          this.errorMessage = 'Failed to remove product from wishlist';
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(product.id, this.userId!).subscribe({
        next: () => {
          // Add product ID to local wishlist array
          this.wishlistItems.push(product.id);
        },
        error: () => {
          this.errorMessage = 'Failed to add product to wishlist';
        }
      });
    }
  }

  // Check if the product is in the user's wishlist
  isInWishlist(product: Product): boolean {
    return this.wishlistItems.includes(product.id); // Check if product ID is in the wishlist array
  }

  // Redirect to the wishlist page
  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  // Get the class for the heart icon (filled or empty)
  getHeartClass(product: Product): string {
    return this.isInWishlist(product) ? 'heart-filled' : 'heart-empty'; // Example class names for heart icon
  }
}
