import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Needed for routerLink to work
import { CommonModule } from '@angular/common'; // ✅ Needed for ngClass and other common directives

@Component({
  selector: 'app-header',
  standalone: true, // ✅ Needed for standalone components
  imports: [RouterModule, CommonModule], // ✅ Enables routerLink and ngClass
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // ✅ Corrected from 'styleUrl'
})
export class HeaderComponent {
  wishlistFilled = false;

  toggleWishlist(): void {
    this.wishlistFilled = !this.wishlistFilled;
  }
}
