import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  message: string = '';
  selectedFile: File | null = null;
  isAuthenticated: boolean = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      profilePicture: [null]
    });

    const storedUser = localStorage.getItem('user');
    this.isAuthenticated = !!storedUser;

    if (this.isAuthenticated && storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid && this.selectedFile) {
      const formData = new FormData();
      const { name, email, password } = this.signupForm.value;

      formData.append('name', name || '');
      formData.append('email', email);
      formData.append('password', password || '');
      formData.append('profilePicture', this.selectedFile);

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.message = 'Signup successful!';
          console.log('Signup response:', response);
          localStorage.setItem('user', JSON.stringify(response));
          this.isAuthenticated = true;
          this.currentUser = response;
        },
        error: (err) => {
          this.message = 'Signup failed. Please try again.';
          console.error('Signup error:', err);
        }
      });
    } else {
      this.message = 'Please fill out the form and upload a profile picture.';
    }
  }

  // ✅ Define logout method
  logout(): void {
    localStorage.removeItem('user');
    this.isAuthenticated = false;
    this.currentUser = null;
  }
}
