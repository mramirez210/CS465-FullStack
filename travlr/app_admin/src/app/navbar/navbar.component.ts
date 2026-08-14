import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  currentUserName(): string {
    return this.authenticationService.getCurrentUser()?.name || 'Administrator';
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
  }
}
