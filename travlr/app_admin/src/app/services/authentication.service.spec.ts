import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BROWSER_STORAGE } from '../storage';
import { AuthenticationService } from './authentication.service';

const createStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) || null,
    key: (index: number) => Array.from(values.keys())[index] || null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value)
  } as Storage;
};

const makeToken = (expiresAt: number): string => {
  const payload = btoa(JSON.stringify({
    _id: 'mock-user',
    email: 'admin@travlr.com',
    name: 'Travlr Administrator',
    exp: expiresAt,
    iat: Math.floor(Date.now() / 1000)
  }));
  return `header.${payload}.signature`;
};

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTesting: HttpTestingController;
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('logs in through the API and stores the returned token', () => {
    const token = makeToken(Math.floor(Date.now() / 1000) + 3600);

    service.login('admin@travlr.com', 'Travlr123!').subscribe((response) => {
      expect(response.token).toBe(token);
    });

    const request = httpTesting.expectOne('http://localhost:3000/api/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.email).toBe('admin@travlr.com');
    request.flush({ token });

    expect(storage.getItem('travlr-token')).toBe(token);
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getCurrentUser()?.name).toBe('Travlr Administrator');
  });

  it('removes an expired token and reports the user as signed out', () => {
    storage.setItem('travlr-token', makeToken(Math.floor(Date.now() / 1000) - 60));

    expect(service.isLoggedIn()).toBeFalse();
    expect(storage.getItem('travlr-token')).toBeNull();
  });
});
