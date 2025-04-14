import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  name = '';
  description = '';
  price: number | null = null;
  image: File | null = null;
  loading = false;
  message = '';

  products: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit() {
    if (!this.name || !this.description || !this.price || !this.image) {
      this.message = 'Please fill all fields and select an image.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', this.price.toString());
    formData.append('image', this.image);

    this.loading = true;

    this.http.post<any>('http://localhost:3000/products', formData).subscribe({
      next: (res) => {
        this.message = 'Product added successfully!';
        this.loading = false;
        this.resetForm();
        this.fetchProducts();
      },
      error: (err) => {
        this.message = err.error?.message || 'Something went wrong.';
        this.loading = false;
      }
    });
  }

  fetchProducts() {
    this.http.get<any[]>('http://localhost:3000/products').subscribe({
      next: (data) => this.products = data,
      error: () => this.message = 'Failed to fetch products.'
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.http.delete(`http://localhost:3000/products/${id}`).subscribe({
      next: () => {
        this.message = 'Product deleted successfully.';
        this.fetchProducts();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to delete product.';
      }
    });
  }

  resetForm() {
    this.name = '';
    this.description = '';
    this.price = null;
    this.image = null;
  }
}
