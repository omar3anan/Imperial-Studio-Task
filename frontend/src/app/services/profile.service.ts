import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profile {
  id: number;
  name: string;
  email: string;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/${userId}`);
  }

  uploadProfilePicture(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post(
      `${this.baseUrl}/profile-picture/${userId}`,
      formData,
      { responseType: 'json' }
    );
  }
}
