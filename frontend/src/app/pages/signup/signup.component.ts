import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string | null = null;
  fileError: string | null = null;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadSuccessMessage: string | null = null; // To store success message

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if the user is already authorised.
    if (localStorage.getItem('isAuthorised') === 'true') {
      this.router.navigate(['/profile']);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.fileError = null;
        this.uploadSuccessMessage = 'Profile picture uploaded successfully!'; // Success message
      } else {
        this.fileError = 'Please select a valid image file.';
        this.uploadSuccessMessage = null; // Reset success message if invalid file
      }
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      // Prepare form data, including the file
      const formData = new FormData();
      formData.append('name', this.signupForm.value.name);
      formData.append('email', this.signupForm.value.email);
      formData.append('password', this.signupForm.value.password);

      // Append file if selected
      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
      }

      // Send the form data to the backend
      this.isUploading = true;
      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          // Set flag to indicate user is authorised
          localStorage.setItem('isAuthorised', 'true');
          // Trigger a page reload to reflect changes like profile picture
          window.location.reload(); // This reloads the entire page
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.error = err.error?.message || 'Registration failed. Please try again.';
        },
        complete: () => {
          this.isUploading = false;
        }
      });
    } else {
      // Mark all controls as touched to trigger validation messages for the user
      this.signupForm.markAllAsTouched();
    }
  }
}
