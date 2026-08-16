import { Inject, Injectable } from '@angular/core';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly tokenKey = 'travlr-token';

  constructor(@Inject(BROWSER_STORAGE) private storage: Storage) {}

  public getToken(): string {
    return this.storage.getItem(this.tokenKey) || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  public logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    const payload = this.decodeTokenPayload();
    if (!payload) {
      return false;
    }

    return typeof payload.exp === 'number' && payload.exp > Date.now() / 1000;
  }

  public getCurrentUser(): User | null {
    const payload = this.decodeTokenPayload();
    if (!payload || !this.isLoggedIn()) {
      return null;
    }

    return {
      email: payload.email || '',
      name: payload.name || ''
    } as User;
  }

  private decodeTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Malformed JWT');
      }

      let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (payload.length % 4 !== 0) {
        payload += '=';
      }

      return JSON.parse(atob(payload));
    } catch {
      this.logout();
      return null;
    }
  }
}