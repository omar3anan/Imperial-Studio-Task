import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export interface User {
  name: string;
  email: string;
  token?: string;  // Token for authentication
  profilePicture?: string;  // Profile picture URL (this is optional)
  password?: string;  // Password for login form
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this._userSubject.asObservable();

  private apiUrl = 'http://localhost:3000/auth/login'; // Your backend URL
  private uploadUrl = 'http://localhost:3000/auth/upload'; // Image upload URL

  constructor(private http: HttpClient) {}

  // Login method sends a POST request to the backend
  login(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        console.error('Login failed', error);
        throw error;
      })
    );
  }

  // Upload image method
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.uploadUrl, formData).pipe(
      catchError(error => {
        console.error('Image upload failed', error);
        throw error;
      })
    );
  }

  // Logout method
  logout() {
    this._userSubject.next(null);
  }

  // Update user details (for example, after successful login)
  setUser(user: User) {
    this._userSubject.next(user);
  }

  // Load user from localStorage (optional)
  loadUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.setUser(JSON.parse(user));
    }
  }
}
