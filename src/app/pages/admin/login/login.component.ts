import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/admin/dashboard']);
  }

  login() {
    if (!this.username || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    setTimeout(() => {
      const ok = this.auth.login(this.username, this.password);
      if (ok) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error = 'Invalid credentials. Try admin / admin123';
        this.loading = false;
      }
    }, 800);
  }
}
