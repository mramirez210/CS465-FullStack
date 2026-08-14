import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input() trip!: Trip;

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
  ) {}

  editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  deleteTrip(trip: Trip): void {
    if (!confirm(`Delete trip ${trip.code}?`)) {
      return;
    }

    this.tripDataService.deleteTrip(trip.code).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: unknown) => {
        console.log('Error:', error);
      },
    });
  }

  imagePath(image: string): string {
    if (image.startsWith('/images/')) {
      return `assets${image}`;
    }
    if (image.startsWith('assets/')) {
      return image;
    }
    return `assets/images/${image}`;
  }

  priceValue(price: string): number {
    return Number(price.replace(/[^0-9.]/g, '')) || 0;
  }
}
