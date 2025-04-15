import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component'; // ✅ Add this import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent], // ✅ Add HeaderComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // 🛠 this should be style**s**Urls not styleUrl
})
export class AppComponent {
  title = 'frontend'; // Add your title or other app-level variables here
}
