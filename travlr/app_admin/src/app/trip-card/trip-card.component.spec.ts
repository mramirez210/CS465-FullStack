import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Trip } from '../models/trip';
import { TripCardComponent } from './trip-card.component';

const mockTrip: Trip = {
  code: 'MOCK260804',
  name: 'Mock Island Escape',
  length: '5 nights / 6 days',
  start: '2026-08-04T08:00:00.000Z',
  resort: 'Testing Bay, 4 stars',
  perPerson: '1499.00',
  image: 'reef1.jpg',
  description: '<p>A trip supplied by a component test.</p>'
};

describe('TripCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders one trip from mock data', () => {
    const fixture = TestBed.createComponent(TripCardComponent);
    fixture.componentInstance.trip = mockTrip;
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain(mockTrip.name);
    expect(element.textContent).toContain(mockTrip.code);
    expect(element.textContent).toContain(mockTrip.resort);
  });

  it('emits the selected trip code for deletion', () => {
    const fixture = TestBed.createComponent(TripCardComponent);
    fixture.componentInstance.trip = mockTrip;
    spyOn(fixture.componentInstance.deleteRequested, 'emit');

    fixture.componentInstance.requestDelete();

    expect(fixture.componentInstance.deleteRequested.emit)
      .toHaveBeenCalledWith(mockTrip.code);
  });

  it('only displays edit and delete controls to authenticated administrators', () => {
    const fixture = TestBed.createComponent(TripCardComponent);
    fixture.componentInstance.trip = mockTrip;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.trip-actions')).toBeNull();

    fixture.componentInstance.canManage = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.trip-actions')).not.toBeNull();
  });
});
