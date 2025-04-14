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
  // Base URL for users endpoints
  private baseUrl: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  /**
   * Gets the profile data for the user with the specified id.
   * @param userId The user id.
   */
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
