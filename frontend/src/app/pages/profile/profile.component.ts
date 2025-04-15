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
  isProcessing: boolean = false;  // Flag to show processing window


  constructor(
    private profileService: ProfileService,
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

      // Show processing window
      this.isProcessing = true;

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

              // Trigger a page reload to reflect changes like the profile picture
              window.location.reload(); // This will reload the page to update the UI

              // Hide processing window
              this.isProcessing = false;
            },
            error: (err) => {
              console.error('Failed to refresh profile after upload:', err);
              // Hide processing window on error
              this.isProcessing = false;
            }
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to upload profile picture';
          // Hide processing window on error
          this.isProcessing = false;
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('isAuthorised');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    // Trigger a page reload to clear the UI and reset the app state
    window.location.reload(); // This will reload the page, effectively logging the user out
  }
}
