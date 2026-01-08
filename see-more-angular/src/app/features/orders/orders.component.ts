import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ApiService, Product } from '../../core/api.service';
import { Router } from '@angular/router';

interface FilterOption {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-orders',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private router = inject(Router);
  constructor(private apiService: ApiService) {}

  // Filter states
  private brandsSubject = new BehaviorSubject<FilterOption[]>([]);
  private categoriesSubject = new BehaviorSubject<FilterOption[]>([]);
  private manufacturersSubject = new BehaviorSubject<FilterOption[]>([]);

  // Observables
  brands$ = this.brandsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  manufacturers$ = this.manufacturersSubject.asObservable();
  viewProduct(productName: string): void {
    // Convert product name to URL-friendly slug
    const slug = productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    this.router.navigate(['/product', slug]);
  }

  // Signals
  brands = signal<FilterOption[]>([]);
  categories = signal<FilterOption[]>([]);
  manufacturers = signal<FilterOption[]>([]);

  // Products from API
  private allProductsSubject = new BehaviorSubject<Product[]>([]);

  // Filtered products
  filteredProducts$: Observable<Product[]> = combineLatest([
    this.allProductsSubject,
    this.brandsSubject,
    this.categoriesSubject,
    this.manufacturersSubject,
  ]).pipe(
    map(([products, brands, categories, manufacturers]) => {
      let filtered = [...products];

      // Filter by brands
      const selectedBrands = brands
        .filter((b) => b.checked)
        .map((b) => b.label);
      if (selectedBrands.length > 0) {
        filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
      }

      // Filter by categories
      const selectedCategories = categories
        .filter((c) => c.checked)
        .map((c) => c.label);
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((p) =>
          selectedCategories.includes(p.category)
        );
      }

      // Filter by manufacturers
      const selectedManufacturers = manufacturers
        .filter((m) => m.checked)
        .map((m) => m.label);
      if (selectedManufacturers.length > 0) {
        filtered = filtered.filter((p) =>
          selectedManufacturers.includes(p.manufacturer)
        );
      }

      return filtered;
    })
  );

  ngOnInit(): void {
    // Load products from API
    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.allProductsSubject.next(products);
        this.generateFilters(products);
        console.log('Products loaded from API:', products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  private generateFilters(products: Product[]): void {
    // Extract unique brands
    const uniqueBrands = [...new Set(products.map((p) => p.brand))].sort();
    const brandFilters = uniqueBrands.map((brand) => ({
      label: brand,
      checked: false,
    }));
    this.brands.set(brandFilters);
    this.brandsSubject.next(brandFilters);

    // Extract unique categories
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category)),
    ].sort();
    const categoryFilters = uniqueCategories.map((category) => ({
      label: category,
      checked: false,
    }));
    this.categories.set(categoryFilters);
    this.categoriesSubject.next(categoryFilters);

    // Extract unique manufacturers
    const uniqueManufacturers = [
      ...new Set(products.map((p) => p.manufacturer)),
    ].sort();
    const manufacturerFilters = uniqueManufacturers.map((manufacturer) => ({
      label: manufacturer,
      checked: false,
    }));
    this.manufacturers.set(manufacturerFilters);
    this.manufacturersSubject.next(manufacturerFilters);
  }

  // Method to update filters when checkboxes change
  onBrandChange(): void {
    this.brandsSubject.next(this.brands());
  }

  onCategoryChange(): void {
    this.categoriesSubject.next(this.categories());
  }

  onManufacturerChange(): void {
    this.manufacturersSubject.next(this.manufacturers());
  }

  clearFilters(): void {
    const clearedBrands = this.brands().map((b) => ({ ...b, checked: false }));
    const clearedCategories = this.categories().map((c) => ({
      ...c,
      checked: false,
    }));
    const clearedManufacturers = this.manufacturers().map((m) => ({
      ...m,
      checked: false,
    }));

    this.brands.set(clearedBrands);
    this.categories.set(clearedCategories);
    this.manufacturers.set(clearedManufacturers);

    this.brandsSubject.next(clearedBrands);
    this.categoriesSubject.next(clearedCategories);
    this.manufacturersSubject.next(clearedManufacturers);
  }
}
