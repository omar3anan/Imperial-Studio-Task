import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Optional: for additional styling
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the login form with email and password fields
    this.loginForm = this.fb.group({
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
  onSubmit(): void {
    if (this.loginForm.valid) {
      // Use non-null assertions to ensure values are strings when form is valid
      const formValue = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(formValue).subscribe({
        next: (response) => {
          console.log('User logged in successfully:', response);
          // Set flag to indicate user is authorised
          localStorage.setItem('isAuthorised', 'true');

          // Navigate to the profile page after successful login
          this.router.navigate(['/profile']).then(() => {
            // Trigger a page reload to ensure any changes (e.g., profile picture) are updated
            window.location.reload(); // This will reload the page to update the UI
          });
        },
        error: (err) => {
          console.error('Login error:', err);
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      });
    } else {
      // Mark all controls as touched to trigger validation feedback
      this.loginForm.markAllAsTouched();
    }
  }

}
