import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';

interface JwtPayload extends User {
  exp: number;
  iat: number;
  _id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(BROWSER_STORAGE);

  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly tokenKey = 'travlr-token';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        ...user,
        password,
      })
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  getToken(): string {
    return this.storage.getItem(this.tokenKey) || '';
  }

  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const payload = this.getPayload();
    const loggedIn = Boolean(payload && payload.exp > Date.now() / 1000);

    if (!loggedIn && this.getToken()) {
      this.logout();
    }

    return loggedIn;
  }

  getCurrentUser(): User | null {
    const payload = this.getPayload();
    return payload ? { email: payload.email, name: payload.name } : null;
  }

  private getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const encodedPayload = token.split('.')[1];
      if (!encodedPayload) {
        return null;
      }

      const normalized = encodedPayload
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');

      const jsonPayload = decodeURIComponent(
        atob(normalized)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }
}