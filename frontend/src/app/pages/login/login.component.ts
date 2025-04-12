// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Create the login form with email and password controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      // Send POST request to the login endpoint
      this.http.post<any>('http://localhost:3000/auth/login', loginData)
        .subscribe({
          next: (response) => {
            // Handle successful login (e.g., store token, update AuthService, etc.)
            this.message = 'Login successful';
            console.log('Login response:', response);
          },
          error: (error) => {
            this.message = 'Login failed. Please check your credentials.';
            console.error('Login error:', error);
          }
        });
    }
  }
}
