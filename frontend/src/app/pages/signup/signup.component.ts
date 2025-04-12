// signup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Create the signup form with name, email, and password controls
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      // Send POST request to the registration endpoint
      this.http.post<any>('http://localhost:3000/auth/register', signupData)
        .subscribe({
          next: (response) => {
            // Handle successful signup (e.g., redirect to login, auto-login, etc.)
            this.message = 'Signup successful';
            console.log('Signup response:', response);
          },
          error: (error) => {
            this.message = 'Signup failed. Please try again.';
            console.error('Signup error:', error);
          }
        });
    }
  }
}
