import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { OrdersComponent } from './orders.component';
import { ApiService, Product } from '../../core/api.service';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let apiServiceMock: any;
  let routerMock: any;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product A',
      brand: 'Brand X',
      manufacturer: 'Mfg 1',
      price: 100,
      image: 'a.jpg',
      category: 'Cat 1',
      description: 'Desc A'
    },
    {
      id: 2,
      name: 'Product B',
      brand: 'Brand Y',
      manufacturer: 'Mfg 2',
      price: 200,
      image: 'b.jpg',
      category: 'Cat 2',
      description: 'Desc B'
    },
    {
      id: 3,
      name: 'Product C',
      brand: 'Brand X',
      manufacturer: 'Mfg 1',
      price: 150,
      image: 'c.jpg',
      category: 'Cat 1',
      description: 'Desc C'
    }
  ];

  beforeEach(async () => {
    apiServiceMock = {
      getProducts: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load products from API', async () => {
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.filteredProducts$.subscribe(products => {
        expect(products.length).toBe(3);
      });
    });

    it('should generate filters from products', async () => {
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.brands().length).toBe(2);
      expect(component.categories().length).toBe(2);
      expect(component.manufacturers().length).toBe(2);
    });

    it('should handle API error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      apiServiceMock.getProducts.mockReturnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('filter operations', () => {
    beforeEach(async () => {
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('should filter by brand', async () => {
      const brands = component.brands();
      brands[0].checked = true;
      component.onBrandChange();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.filteredProducts$.subscribe(products => {
        expect(products.every(p => p.brand === brands[0].label)).toBe(true);
      });
    });

    it('should filter by category', async () => {
      const categories = component.categories();
      categories[0].checked = true;
      component.onCategoryChange();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.filteredProducts$.subscribe(products => {
        expect(products.every(p => p.category === categories[0].label)).toBe(true);
      });
    });

    it('should filter by manufacturer', async () => {
      const manufacturers = component.manufacturers();
      manufacturers[0].checked = true;
      component.onManufacturerChange();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.filteredProducts$.subscribe(products => {
        expect(products.every(p => p.manufacturer === manufacturers[0].label)).toBe(true);
      });
    });

    it('should apply multiple filters together', async () => {
      const brands = component.brands();
      brands[0].checked = true;
      component.onBrandChange();

      const categories = component.categories();
      categories[0].checked = true;
      component.onCategoryChange();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.filteredProducts$.subscribe(products => {
        expect(products.every(p => p.brand === brands[0].label && p.category === categories[0].label)).toBe(true);
      });
    });
  });

  describe('clearFilters', () => {
    beforeEach(async () => {
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('should uncheck all filters', () => {
      const brands = component.brands();
      brands[0].checked = true;
      const categories = component.categories();
      categories[0].checked = true;

      component.clearFilters();

      expect(component.brands().every(b => !b.checked)).toBe(true);
      expect(component.categories().every(c => !c.checked)).toBe(true);
      expect(component.manufacturers().every(m => !m.checked)).toBe(true);
    });

    it('should show all products after clearing', async () => {
      const brands = component.brands();
      brands[0].checked = true;
      component.onBrandChange();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.clearFilters();

      await new Promise(resolve => setTimeout(resolve, 0));

      component.filteredProducts$.subscribe(products => {
        expect(products.length).toBe(mockProducts.length);
      });
    });
  });

  describe('viewProduct', () => {
    it('should navigate to product with slug', () => {
      component.viewProduct('Product Name 123');

      expect(routerMock.navigate).toHaveBeenCalledWith(['/product', 'product-name-123']);
    });

    it('should handle product names with special characters', () => {
      component.viewProduct('Product @ Name!');

      expect(routerMock.navigate).toHaveBeenCalledWith(['/product', 'product--name']);
    });
  });
});
