// profile.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @Input() user: User | null = null;
}
