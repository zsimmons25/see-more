import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProductComponent } from './product.component';
import { ApiService, Product } from '../../core/api.service';
import { CartService } from '../../core/cart.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let apiServiceMock: any;
  let cartServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: Partial<ActivatedRoute>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    brand: 'Test Brand',
    manufacturer: 'Test Mfg',
    price: 99.99,
    image: 'test.jpg',
    category: 'Electronics',
    description: 'Test description'
  };

  const mockProducts: Product[] = [mockProduct];

  beforeEach(async () => {
    apiServiceMock = {
      getProducts: vi.fn()
    };

    cartServiceMock = {
      addItem: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn()
        }
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load product when name slug is provided', async () => {
      (activatedRouteMock.snapshot!.paramMap.get as any).mockReturnValue('test-product');
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.product()).toEqual(mockProduct);
      expect(component.loading()).toBe(false);
    });

    it('should set error when no name slug is provided', () => {
      (activatedRouteMock.snapshot!.paramMap.get as any).mockReturnValue(null);

      component.ngOnInit();

      expect(component.error()).toBe('No product name provided');
      expect(component.loading()).toBe(false);
    });

    it('should set error when product not found', async () => {
      (activatedRouteMock.snapshot!.paramMap.get as any).mockReturnValue('nonexistent');
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.error()).toBe('Product not found');
      expect(component.loading()).toBe(false);
    });

    it('should handle API error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (activatedRouteMock.snapshot!.paramMap.get as any).mockReturnValue('test-product');
      apiServiceMock.getProducts.mockReturnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.error()).toBe('Failed to load product');
      expect(component.loading()).toBe(false);
      consoleErrorSpy.mockRestore();
    });

    it('should set product images', async () => {
      (activatedRouteMock.snapshot!.paramMap.get as any).mockReturnValue('test-product');
      apiServiceMock.getProducts.mockReturnValue(of(mockProducts));

      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component.images()).toEqual(['Test Product.png', 'Test Brand.png']);
    });
  });

  describe('image selection', () => {
    it('should select image by index', () => {
      component.selectImage(1);

      expect(component.selectedImageIndex()).toBe(1);
    });
  });

  describe('quantity management', () => {
    it('should increment quantity up to max of 5', () => {
      component.quantity.set(4);

      component.incrementQuantity();
      expect(component.quantity()).toBe(5);

      component.incrementQuantity();
      expect(component.quantity()).toBe(5);
    });

    it('should decrement quantity down to min of 1', () => {
      component.quantity.set(2);

      component.decrementQuantity();
      expect(component.quantity()).toBe(1);

      component.decrementQuantity();
      expect(component.quantity()).toBe(1);
    });

    it('should reset quantity to 1 if below 1 on change', () => {
      component.quantity.set(0);

      component.onQuantityChange();

      expect(component.quantity()).toBe(1);
    });

    it('should cap quantity to 5 if above 5 on change', () => {
      component.quantity.set(10);

      component.onQuantityChange();

      expect(component.quantity()).toBe(5);
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      component.product.set(mockProduct);
      component.quantity.set(2);
    });

    it('should add item to cart with correct data', () => {
      component.addToCart();

      expect(cartServiceMock.addItem).toHaveBeenCalledWith({
        productId: 1,
        productName: 'Test Product',
        quantity: 2,
        price: 99.99
      });
    });

    it('should navigate to cart after adding', () => {
      component.addToCart();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/cart']);
    });

    it('should not add to cart if no product', () => {
      component.product.set(null);

      component.addToCart();

      expect(cartServiceMock.addItem).not.toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('should navigate to orders page', () => {
      component.goBack();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/orders']);
    });
  });
});
