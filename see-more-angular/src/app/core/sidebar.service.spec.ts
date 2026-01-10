import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with sidebar closed', () => {
      expect(service.isOpen()).toBe(false);
      expect(service.getState()).toBe(false);
    });

    it('should have isOpen$ observable initialized to false', async () => {
      const value = await new Promise<boolean>(resolve => {
        service.isOpen$.subscribe(v => resolve(v));
      });
      expect(value).toBe(false);
    });
  });

  describe('open', () => {
    it('should set sidebar to open', () => {
      service.open();

      expect(service.isOpen()).toBe(true);
      expect(service.getState()).toBe(true);
    });

    it('should emit true via isOpen$ observable', async () => {
      const values: boolean[] = [];
      service.isOpen$.subscribe(v => values.push(v));

      service.open();

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(values).toContain(true);
    });

    it('should keep sidebar open if already open', () => {
      service.open();
      service.open();

      expect(service.isOpen()).toBe(true);
      expect(service.getState()).toBe(true);
    });
  });

  describe('close', () => {
    beforeEach(() => {
      service.open();
    });

    it('should set sidebar to closed', () => {
      service.close();

      expect(service.isOpen()).toBe(false);
      expect(service.getState()).toBe(false);
    });

    it('should emit false via isOpen$ observable', async () => {
      const values: boolean[] = [];
      service.isOpen$.subscribe(v => values.push(v));

      service.close();

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(values).toContain(false);
    });

    it('should keep sidebar closed if already closed', () => {
      service.close();
      service.close();

      expect(service.isOpen()).toBe(false);
      expect(service.getState()).toBe(false);
    });
  });

  describe('toggle', () => {
    it('should toggle from closed to open', () => {
      expect(service.isOpen()).toBe(false);

      service.toggle();

      expect(service.isOpen()).toBe(true);
      expect(service.getState()).toBe(true);
    });

    it('should toggle from open to closed', () => {
      service.open();
      expect(service.isOpen()).toBe(true);

      service.toggle();

      expect(service.isOpen()).toBe(false);
      expect(service.getState()).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      service.toggle(); // open
      expect(service.isOpen()).toBe(true);

      service.toggle(); // close
      expect(service.isOpen()).toBe(false);

      service.toggle(); // open
      expect(service.isOpen()).toBe(true);
    });

    it('should emit toggled state via isOpen$ observable', async () => {
      const values: boolean[] = [];
      service.isOpen$.subscribe(v => values.push(v));

      service.toggle();
      await new Promise(resolve => setTimeout(resolve, 0));

      service.toggle();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(values).toEqual([false, true, false]);
    });
  });

  describe('getState', () => {
    it('should return current state', () => {
      expect(service.getState()).toBe(false);

      service.open();
      expect(service.getState()).toBe(true);

      service.close();
      expect(service.getState()).toBe(false);
    });
  });

  describe('signal and observable sync', () => {
    it('should keep signal and observable in sync when using open', async () => {
      let observableValue: boolean | undefined;
      service.isOpen$.subscribe(v => observableValue = v);

      service.open();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(service.isOpen()).toBe(observableValue);
    });

    it('should keep signal and observable in sync when using close', async () => {
      let observableValue: boolean | undefined;
      service.isOpen$.subscribe(v => observableValue = v);

      service.close();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(service.isOpen()).toBe(observableValue);
    });

    it('should keep signal and observable in sync when using toggle', async () => {
      let observableValue: boolean | undefined;
      service.isOpen$.subscribe(v => observableValue = v);

      service.toggle();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(service.isOpen()).toBe(observableValue);
    });
  });
});
