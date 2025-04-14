import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl: string = 'http://localhost:3000/wishlist'; // API base URL

  constructor(private http: HttpClient) {}

  // Add product to wishlist
  addToWishlist(productId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${productId}/user/${userId}`, {});
  }

  // Remove product from wishlist
  removeFromWishlist(productId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}/user/${userId}`);
  }

  // Get wishlist items (returns an array of product IDs)
  getWishlistItems(userId: number): Observable<{ wishlist: number[] }> {
    // Expecting response to contain an object with the 'wishlist' property as an array of product IDs
    return this.http.get<{ wishlist: number[] }>(`${this.baseUrl}/user/${userId}`);
  }
}
