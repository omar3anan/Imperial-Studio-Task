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
  styleUrls: ['./signup.component.css'] // Optional: include for custom styles if needed
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form inside the constructor
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

  onSubmit(): void {
    if (this.signupForm.valid) {
      // Using non-null assertions to ensure the values are non-null when the form is valid
      const formValue = {
        name: this.signupForm.value.name!,
        email: this.signupForm.value.email!,
        password: this.signupForm.value.password!
      };

      this.authService.register(formValue).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          // Set flag to indicate user is authorised
          localStorage.setItem('isAuthorised', 'true');
          // Automatically navigate to the profile page after successful registration.
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.error = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      // Mark all controls as touched to trigger validation messages for the user
      this.signupForm.markAllAsTouched();
    }
  }
}
