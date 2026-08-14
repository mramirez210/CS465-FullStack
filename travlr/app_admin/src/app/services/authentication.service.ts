import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly tokenKey = 'travlr-token';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      ...user,
      password
    }).pipe(tap((response) => this.saveToken(response.token)));
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
      return JSON.parse(atob(normalized)) as JwtPayload;
    } catch {
      return null;
    }
  }
}
