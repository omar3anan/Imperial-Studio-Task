import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null>; // Observable for the user
  user: User = { name: '', email: '', password: '', profilePicture: '' }; // Include profilePicture and password

  constructor(public authService: AuthService) {
    // Make authService public so it can be accessed in the template
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // You may add logic to load the user if required
  }

  // Handle login form submission
  onLogin() {
    this.authService.login(this.user).subscribe(
      (authenticatedUser: User) => {
        console.log('Login successful:', authenticatedUser);
        this.authService.setUser(authenticatedUser);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  // Handle image drop/upload for profile picture
  onImageDrop(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.authService.uploadImage(formData).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response);
          // Optionally, update the user's profile picture URL
          this.authService.setUser({ ...this.user, profilePicture: response.profilePicture });
        },
        (error) => {
          console.error('Image upload failed:', error);
        }
      );
    }
  }
}
