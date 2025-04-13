import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // Import necessary modules here
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  selectedFile: File | null = null;
  profilePictureUrl: string | undefined;
  defaultProfilePic = 'path/to/default/profile/pic.png';  // Add a default profile picture URL if no profile picture

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['']
    });
  }

  ngOnInit(): void {
    // Subscribe to the user observable to get the current user info
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
        this.profilePictureUrl = user.profilePicture || this.defaultProfilePic;  // Set the profile picture URL
      }
    });
  }

  // Handle file change for profile picture upload
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];  // Capture the selected file
  }

  // Submit the updated profile info and profile picture
  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileForm.value.name);
      formData.append('email', this.profileForm.value.email);

      // If a new profile picture is selected, append it to the formData
      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);
      }

      // Send the updated data to the backend to update the profile
      this.http.put<any>(`${environment.apiUrl}/auth/update-profile`, formData).subscribe({
        next: (response) => {
          // Handle successful profile update
          this.authService.setUser(response.updatedUser);  // Update user info in AuthService
          this.profilePictureUrl = response.updatedUser.profilePicture;  // Update profile picture URL
          console.log('Profile updated successfully', response);
        },
        error: (error) => {
          console.error('Profile update failed', error);
        }
      });
    }
  }

  // Logout method to clear user data and logout the user
  onLogout(): void {
    this.authService.logout();  // Call the logout method in your authService
    this.currentUser = null;  // Clear the current user data
    console.log('Logged out successfully');
  }
}
