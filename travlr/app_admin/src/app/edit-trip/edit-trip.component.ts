import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
  editForm: FormGroup;
  originalCode = '';
  submitted = false;
  loading = true;
  saving = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripDataService: TripDataService
  ) {
    this.editForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}\d{6}$/)]],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get f() {
    return this.editForm.controls;
  }

  ngOnInit(): void {
    this.originalCode = this.route.snapshot.paramMap.get('tripCode') || '';

    if (!this.originalCode) {
      this.router.navigate(['/']);
      return;
    }

    this.tripDataService.getTrip(this.originalCode).subscribe({
      next: (trips) => {
        const trip = trips[0];

        if (!trip) {
          this.errorMessage = 'The requested trip could not be found.';
          this.loading = false;
          return;
        }

        this.editForm.patchValue({
          ...trip,
          start: trip.start.substring(0, 10)
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'The trip could not be loaded.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const trip = this.editForm.getRawValue() as Trip;

    this.tripDataService.updateTrip(this.originalCode, trip).subscribe({
      next: (updatedTrip) => {
        this.router.navigate(['/'], { queryParams: { updated: updatedTrip.code } });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'The trip could not be updated.';
        this.saving = false;
      }
    });
  }
}
