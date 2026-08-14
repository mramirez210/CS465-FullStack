import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private tripDataService: TripDataService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  get canManageTrips(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  ngOnInit(): void {
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
      },
      error: () => {
        this.errorMessage = 'Trips could not be loaded from the API server.';
        this.loading = false;
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
      },
      error: (error) => {
        this.errorMessage = error.status === 401
          ? 'Your session is no longer valid. Log in again before deleting a trip.'
          : `Trip ${tripCode} could not be deleted.`;
      }
    });
  }
}
