import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  public formError = '';
  public submitted = false;

  public credentials = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.submitted = true;
    this.formError = '';

    if (
      !this.credentials.email ||
      !this.credentials.password ||
      !this.credentials.name
    ) {
      this.formError = 'All fields are required, please try again';
      return;
    }

    this.doLogin();
  }

  private doLogin(): void {
    const newUser: User = {
      name: this.credentials.name,
      email: this.credentials.email,
    };

    this.authenticationService
      .login(newUser, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err: unknown) => {
          const errorMsg = (err as { error?: { message?: string }; message?: string })?.error?.message 
            || (err as { message?: string })?.message;
          this.formError = errorMsg || 'Login failed. Please check your credentials.';
        },
      });
  }
}