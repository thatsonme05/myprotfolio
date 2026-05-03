import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'admin123';
  private readonly KEY = 'maulidin_auth';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USER && password === this.ADMIN_PASS) {
      localStorage.setItem(this.KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.KEY);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.KEY) === 'true';
  }
}
