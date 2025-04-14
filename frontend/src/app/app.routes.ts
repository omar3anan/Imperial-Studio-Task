// app.routes.ts
import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' }
];
