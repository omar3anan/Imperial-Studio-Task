import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'  // Singleton service provided in the root
})
export class AuthService {
  // Base URL for the auth endpoints
  private baseUrl: string = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  /**
   * Sends a registration request to the back-end, including a profile picture if provided.
   *
   * @param user - An object containing name, email, password, and optionally a profile picture.
   * @returns An Observable that emits the server's response.
   */
  register(formData: FormData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, formData)
      .pipe(
        tap(response => {
          // After a successful registration, save token and user ID in localStorage
          if (response.token && response.user?.id) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user.id.toString());
          }
        })
      );
  }

  /**
   * Sends a login request to the back-end.
   *
   * @param credentials - An object containing email and password.
   * @returns An Observable that emits the server's response.
   */
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // After a successful login, save token and user ID in localStorage
          if (response.token && response.user?.id) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user.id.toString());
          }
        })
      );
  }
}
