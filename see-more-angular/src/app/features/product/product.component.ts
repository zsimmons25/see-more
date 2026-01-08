import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product } from '../../core/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  product = signal<Product | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  selectedImageIndex = signal<number>(0);
  quantity = signal<number>(1);

  images = signal<string[]>([]);

  ngOnInit(): void {
    const nameSlug = this.route.snapshot.paramMap.get('name');
    if (nameSlug) {
      this.loadProductByName(nameSlug);
    } else {
      this.error.set('No product name provided');
      this.loading.set(false);
    }
  }

  loadProductByName(slug: string): void {
    // Load all products and find by name
    this.apiService.getProducts().subscribe({
      next: (products) => {
        const product = products.find((p) => {
          const productSlug = p.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
          return productSlug === slug;
        });

        if (product) {
          this.product.set(product);
          this.images.set([product.name + '.png', product.brand + '.png']);
          this.loading.set(false);
        } else {
          this.error.set('Product not found');
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error.set('Failed to load product');
        this.loading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  onQuantityChange(): void {
    const currentQty = this.quantity();
    if (currentQty < 1) {
      this.quantity.set(1);
    } else if (currentQty > 5) {
      this.quantity.set(5);
    }
  }

  incrementQuantity(): void {
    this.quantity.update((q) => (q < 5 ? q + 1 : 5));
  }

  decrementQuantity(): void {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      console.log(`Adding ${this.quantity()} x ${prod.name} to cart`);
      alert(`Added ${this.quantity()} x ${prod.name} to cart!`);
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
