import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';

export interface User {
  name: string;
  email: string;
  token?: string;
  profilePicture?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this._userSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth/register`;
  private uploadUrl = `${environment.apiUrl}/auth/upload`;

  constructor(private http: HttpClient) {}

  /** Register user with profile picture */
  register(userData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData).pipe(
      catchError(error => {
        console.error('Registration failed', error);
        throw error;
      })
    );
  }

  /** Upload profile picture to AWS S3 or your server */
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.uploadUrl, formData).pipe(
      catchError(error => {
        console.error('Image upload failed', error);
        throw error;
      })
    );
  }

  /** Logout user and clear storage */
  logout(): void {
    this._userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Optional if you store token separately
  }

  /** Set user after login or registration */
  setUser(user: User): void {
    this._userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem('token', user.token);
    }
  }

  /** Load user on app init */
  loadUserFromLocalStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.setUser(JSON.parse(user));
    }
  }

  /** Check if user is authenticated */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}
