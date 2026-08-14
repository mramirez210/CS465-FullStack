import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  submitted = false;
  authenticating = false;
  errorMessage = '';
  statusMessage = '';
  returnUrl = '/';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
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

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authenticating = true;
    const credentials = this.loginForm.getRawValue();

    this.authenticationService.login(
      credentials.email || '',
      credentials.password || ''
    ).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Check your credentials.';
        this.authenticating = false;
      }
    });
  }
}
