import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';
import { TripListingComponent } from './trip-listing.component';

const mockTrips: Trip[] = [{
  code: 'MOCK260804',
  name: 'Mock Island Escape',
  length: '5 nights / 6 days',
  start: '2026-08-04T08:00:00.000Z',
  resort: 'Testing Bay, 4 stars',
  perPerson: '1499.00',
  image: 'reef1.jpg',
  description: '<p>A trip supplied by a service mock.</p>'
}];

describe('TripListingComponent', () => {
  const tripServiceMock = {
    getTrips: jasmine.createSpy('getTrips').and.returnValue(of(mockTrips)),
    deleteTrip: jasmine.createSpy('deleteTrip').and.returnValue(of(void 0))
  };
  const authenticationServiceMock = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripListingComponent],
      providers: [
        provideRouter([]),
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: TripDataService, useValue: tripServiceMock }
      ]
    }).compileComponents();
  });

  it('retrieves mock trips through TripDataService and renders a card', () => {
    const fixture = TestBed.createComponent(TripListingComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(tripServiceMock.getTrips).toHaveBeenCalled();
    expect(fixture.componentInstance.trips).toEqual(mockTrips);
    expect(element.querySelectorAll('app-trip-card').length).toBe(1);
    expect(element.textContent).toContain(mockTrips[0].name);
    expect(element.textContent).toContain('Add Trip');
  });
});
