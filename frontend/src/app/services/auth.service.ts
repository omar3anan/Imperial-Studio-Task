// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject to hold the logged-in user state. Initially, no user is logged in.
  private _userSubject = new BehaviorSubject<User | null>(null);

  // Public observable for components to subscribe to authentication state
  public user$: Observable<User | null> = this._userSubject.asObservable();

  // Simulated login method (in reality you would handle tokens, API calls, etc.)
  login(user: User) {
    this._userSubject.next(user);
  }

  // Simulated logout method
  logout() {
    this._userSubject.next(null);
  }
}
