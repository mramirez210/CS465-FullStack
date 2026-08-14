import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { BROWSER_STORAGE } from '../storage';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let storage: Storage;

  beforeEach(() => {
    storage = window.localStorage;
    storage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    storage.clear();
  });

  it('adds the saved bearer token to API requests', () => {
    storage.setItem('travlr-token', 'mock-jwt');

    http.get('/api/trips').subscribe();

    const request = httpTesting.expectOne('/api/trips');
    expect(request.request.headers.get('Authorization')).toBe('Bearer mock-jwt');
    request.flush([]);
  });

  it('clears an invalid token after a protected request returns 401', () => {
    storage.setItem('travlr-token', 'expired-jwt');

    http.put('/api/trips/TEST260804', {}).subscribe({ error: () => undefined });

    const request = httpTesting.expectOne('/api/trips/TEST260804');
    request.flush(
      { message: 'Authentication token has expired.' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(storage.getItem('travlr-token')).toBeNull();
  });
});
