import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Needed for routerLink to work

@Component({
  selector: 'app-header',
  standalone: true, // ✅ Needed for standalone components
  imports: [RouterModule], // ✅ Enables routerLink in HTML
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // ✅ Corrected from 'styleUrl'
})
export class HeaderComponent { }
