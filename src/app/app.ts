import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
   templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  async ngOnInit() {
    await this.authService.refreshProfile();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  async login() {
    await this.authService.login();
    this.router.navigate(['/']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}