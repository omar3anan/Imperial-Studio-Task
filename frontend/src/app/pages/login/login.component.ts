import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router
import { AuthService, User } from '../../services/auth.service'; // Adjust the path if needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string = '';
  isAuthenticated: boolean = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {
    // Create the login form with email and password controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if the user is already logged in by checking localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.isAuthenticated = true;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      // Send POST request to the login endpoint
      this.http.post<any>('http://localhost:3000/auth/login', loginData)
        .subscribe({
          next: (response) => {
            // Handle successful login
            this.message = 'Login successful';
            this.currentUser = response;
            this.isAuthenticated = true;

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(response));
            this.authService.setUser(response);

            // Redirect to profile page after successful login
            this.router.navigate(['/profile']);  // Navigate to profile page
          },
          error: (error) => {
            // Handle login failure
            this.message = 'Login failed. Please check your credentials.';
            console.error('Login error:', error);
          }
        });
    }
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.currentUser = null;
    this.message = '';
    // Redirect to the login page after logout
    this.router.navigate(['/login']);
  }
}
