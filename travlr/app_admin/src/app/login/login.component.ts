import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formError = '';
  statusMessage = '';
  returnUrl = '/';

  credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    if (this.route.snapshot.queryParamMap.get('loggedOut')) {
      this.statusMessage = 'You have been logged out.';
    } else if (this.route.snapshot.queryParamMap.get('reason') === 'authentication') {
      this.statusMessage = 'Log in to manage trip information.';
    }

    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  onLoginSubmit(): void {
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again.';
      return;
    }

    this.authenticationService.login(
      this.credentials.email,
      this.credentials.password
    ).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: (error) => {
        this.formError = error.error?.message || 'Login failed. Check your credentials.';
      }
    });
  }
}