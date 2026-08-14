import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css'
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  loading = true;
  message = '';
  errorMessage = '';
  canManageTrips = false;

  constructor(
    private tripDataService: TripDataService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    try {
      this.canManageTrips = this.authenticationService.isLoggedIn();
    } catch {
      this.canManageTrips = false;
    }

    const added = this.route.snapshot.queryParamMap.get('added');
    const updated = this.route.snapshot.queryParamMap.get('updated');

    if (added) {
      this.message = `Trip ${added} was added successfully.`;
    } else if (updated) {
      this.message = `Trip ${updated} was updated successfully.`;
    }

    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.errorMessage = '';

    this.tripDataService.getTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Trips could not be loaded from the API server.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteTrip(tripCode: string): void {
    if (!this.canManageTrips) {
      this.errorMessage = 'Log in before deleting trip information.';
      return;
    }

    if (!window.confirm(`Delete trip ${tripCode}? This cannot be undone.`)) {
      return;
    }

    this.tripDataService.deleteTrip(tripCode).subscribe({
      next: () => {
        this.trips = this.trips.filter((trip) => trip.code !== tripCode);
        this.message = `Trip ${tripCode} was deleted.`;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.status === 401
          ? 'Your session is no longer valid. Log in again before deleting a trip.'
          : `Trip ${tripCode} could not be deleted.`;
        this.cdr.detectChanges();
      }
    });
  }
}