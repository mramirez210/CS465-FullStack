import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthenticationService,
          useValue: {
            isLoggedIn: () => false,
            getCurrentUser: () => null,
            logout: () => undefined
          }
        }
      ]
    }).compileComponents();
  });

  it('creates the Travlr admin shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.title).toBe('Travlr Getaways Admin');
  });
});
