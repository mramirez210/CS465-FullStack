import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from '../services/trip-data';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripData: TripData
  ) {}

  public getToken(): string {
    return this.storage.getItem('travlr-token') ?? '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.parseJwtPayload(token);
    if (!payload || !payload.exp) {
      return false;
    }

    return payload.exp > Math.floor(Date.now() / 1000);
  }

  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    const token = this.getToken();
    const payload = this.parseJwtPayload(token);

    if (!payload) {
      return null;
    }

    const { email, name } = payload;
    return { email, name } as User;
  }

  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripData.login(user, passwd).pipe(
      tap((response: AuthResponse) => {
        if (response?.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  public register(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripData.register(user, passwd).pipe(
      tap((response: AuthResponse) => {
        if (response?.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  private parseJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse JWT payload', e);
      return null;
    }
  }
}