import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  firstName = signal<string>('');
  lastName = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  onSubmit(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService
      .register(
        this.firstName(),
        this.lastName(),
        this.email(),
        this.password()
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.error?.message || 'Registration failed. Please try again.'
          );
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
