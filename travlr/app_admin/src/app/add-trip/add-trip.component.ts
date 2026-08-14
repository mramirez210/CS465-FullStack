import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent {
  addForm: FormGroup;
  submitted = false;
  saving = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {
    this.addForm = this.formBuilder.group({
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
    return this.addForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const trip = this.addForm.getRawValue() as Trip;

    this.tripDataService.addTrip(trip).subscribe({
      next: (createdTrip) => {
        this.router.navigate(['/'], { queryParams: { added: createdTrip.code } });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'The trip could not be added.';
        this.saving = false;
      }
    });
  }
}
