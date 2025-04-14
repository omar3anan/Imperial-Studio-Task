import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ProfileService, Profile } from '../../services/profile.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  error: string | null = null;
  loading: boolean = true;

  // Wishlist-related variables
  wishlistItems: Product[] = [];
  wishlistLoading: boolean = true;
  wishlistError: string = '';

  constructor(
    private profileService: ProfileService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.error = 'User is not logged in.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const userId = parseInt(userIdStr, 10);

    // Fetch profile
    this.profileService.getProfile(userId).subscribe({
      next: (profileData) => {
        // Handle both camelCase and snake_case
        this.profile = {
          ...profileData,
          profile_picture: (profileData as any).profile_picture || (profileData as any).profilePicture || null
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile';
        this.loading = false;
      }
    });


  }


  onUploadProfilePicture(event: any): void {
    const file: File = event.target.files[0];
    const userIdStr = localStorage.getItem('userId');

    if (file && userIdStr) {
      const userId = parseInt(userIdStr, 10);
      this.profileService.uploadProfilePicture(userId, file).subscribe({
        next: (response) => {
          console.log('Upload successful:', response);

          // Refresh profile after upload
          this.profileService.getProfile(userId).subscribe({
            next: (updatedProfile) => {
              this.profile = {
                ...updatedProfile,
                profile_picture: (updatedProfile as any).profile_picture || (updatedProfile as any).profilePicture || null
              };
            },
            error: (err) => {
              console.error('Failed to refresh profile after upload:', err);
            }
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to upload profile picture';
        }
      });
    }
  }



  logout(): void {
    localStorage.removeItem('isAuthorised');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
