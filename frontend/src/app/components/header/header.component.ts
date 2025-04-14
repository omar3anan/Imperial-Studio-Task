import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Needed for routerLink to work
import { CommonModule } from '@angular/common'; // ✅ Needed for ngClass and other common directives
import { ProfileService, Profile } from '../../services/profile.service';
import { OnInit } from '@angular/core'; // ✅ Needed for OnInit lifecycle hook
@Component({
  selector: 'app-header',
  standalone: true, // ✅ Needed for standalone components
  imports: [RouterModule, CommonModule], // ✅ Enables routerLink and ngClass
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // ✅ Corrected from 'styleUrl'
})
export class HeaderComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  error = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      const userId = parseInt(userIdStr, 10);
      this.profileService.getProfile(userId).subscribe({
        next: (profileData) => {
          this.profile = {
            ...profileData,
            profile_picture: (profileData as any).profile_picture || (profileData as any).profilePicture || null
          };
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load profile';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
  wishlistFilled = false;

  toggleWishlist(): void {
    this.wishlistFilled = !this.wishlistFilled;
  }
}
